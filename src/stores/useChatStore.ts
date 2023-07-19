import { create } from 'zustand';
import { MessageType, RevokedMsgType, TextBody } from '../services/types';
import apis from '../services/apis';
import useUsersStore from './useUsersStore';
import notificationManager from '../utils/NotificationManager';
import { chatWebSocket } from '../hooks/useWebsocket';
import { ChatWebsocketEvent } from '../utils/ChatWebsocket';
import { WsResponseMessageType } from '../services/wsType';
import { MsgEnum } from '../enums';

export interface IChatStoreState {
  /** 消息列表 */
  messages: MessageType[];
  /** 消息列表翻页游标 */
  pageCursor?: string;
  /** 收到消息时的回调 */
  onReceiveMessage?: (message: MessageType) => void;
  setOnReceiveMessage: (cb: IChatStoreState['onReceiveMessage']) => void;
  initChat: () => Promise<void>;
  fetchMessages: () => Promise<void>;

  addNewMessage: (event: MessageType) => void;
  markRecallMessage: (event: RevokedMsgType) => void;

  /** 发送文本消息 */
  sendTextMessage: (message: string) => Promise<MessageType | void>;
  recallMessage: (msgId: number) => Promise<void>;

  /** 通过消息列表拿到对应的用户，组合为新数组 */
  combineMessageWithUser: (messages: MessageType[]) => Promise<MessageType[]>;
}

export const useChatStore = create<IChatStoreState>((set, get) => ({
  messages: [],
  pageCursor: undefined,
  onReceiveMessage: undefined,
  setOnReceiveMessage(cb) {
    set({
      onReceiveMessage: cb,
    });
  },
  initChat: async () => {
    await get().fetchMessages();
    chatWebSocket.addListener(
      ChatWebsocketEvent[WsResponseMessageType.ReceiveMessage],
      get().addNewMessage,
    );
    chatWebSocket.addListener(
      ChatWebsocketEvent[WsResponseMessageType.WSMsgRecall],
      get().markRecallMessage,
    );
  },
  fetchMessages: async () => {
    const res = await apis
      .getMsgList({ params: { pageSize: 20, roomId: 1, cursor: get().pageCursor } })
      .send();
    const messages = await get().combineMessageWithUser(res.list);
    set({
      pageCursor: res.cursor,
      messages: messages.concat(get().messages),
    });
  },
  addNewMessage: async (event) => {
    const [message] = await get().combineMessageWithUser([event]);
    if (get().messages.findIndex((_) => _.message.id === message.message.id) === -1) {
      set((state) => ({
        messages: state.messages.concat(message),
      }));
      get().onReceiveMessage?.(message);
      notificationManager.pushNotification({
        title: `${message.fromUser.username}发送了一条消息`,
        largeIconUrl: message.fromUser.avatar,
        message: (message.message.body as TextBody).content,
        id: 1,
      });
    }
  },
  markRecallMessage: async ({ msgId }) => {
    console.log('撤回消息', msgId);

    set((state) => {
      const message = state.messages.find((item) => item.message.id === msgId);
      if (message) {
        message.message.type = MsgEnum.RECALL;
        message.message.body = `"${message.fromUser.username}"撤回了一条信息`;
      }
      return {
        messages: [...state.messages],
      };
    });
  },
  sendTextMessage: async (text) => {
    try {
      const message = await apis
        .sendMsg({
          roomId: 1,
          msgType: MsgEnum.TEXT,
          body: {
            content: text,
          },
        })
        .send();
      get().addNewMessage(message);
    } catch (error) {
      console.log(error);
    }
  },
  recallMessage: async (msgId) => {
    apis
      .recallMsg({ msgId, roomId: 1 })
      .send()
      .then(() => {
        get().markRecallMessage({ msgId });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  combineMessageWithUser: async (messages) => {
    const userIds = messages.map((_) => _.fromUser.uid);
    const groupedUsers = await useUsersStore.getState().fetchUsersByUserIds(userIds);

    return messages.map((message) => {
      const user = groupedUsers[message.fromUser.uid];
      message.fromUser = {
        ...user,
        username: user.name,
      };
      return message;
    });
  },
}));
