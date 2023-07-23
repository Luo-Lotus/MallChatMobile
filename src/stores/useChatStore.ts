import { create } from 'zustand';
import { MessageType, RevokedMsgType, TextBody } from '../services/types';
import apis from '../services/apis';
import useUsersStore from './useUsersStore';
import notificationManager from '../utils/NotificationManager';
import { chatWebSocket } from '../hooks/useWebsocket';
import { ChatWebsocketEvent } from '../utils/ChatWebsocket';
import { WsResponseMessageType } from '../services/wsType';
import { MsgEnum } from '../enums';
import { RefObject, createRef } from 'react';
import { FlatList } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import dayjs from 'dayjs';

export interface IChatStoreState {
  /** 消息列表 */
  messages: MessageType[];
  /** 消息列表翻页游标 */
  pageCursor?: string;
  currentReplyingMsgId?: number;
  listRef: RefObject<FlatList>;
  inputRef: RefObject<TextInput>;
  /** 收到消息时的回调 */
  onReceiveMessage?: (message: MessageType) => void;

  setOnReceiveMessage: (cb: IChatStoreState['onReceiveMessage']) => void;
  setCurrentReplyingMsgId: (msgId?: number) => void;
  setListRef: (ref: IChatStoreState['listRef']) => void;
  setInputRef: (ref: IChatStoreState['inputRef']) => void;

  initChat: () => Promise<void>;
  fetchMessages: (pageSize?: number, roomId?: number) => Promise<void>;

  addNewMessage: (event: MessageType) => void;
  markRecallMessage: (event: RevokedMsgType) => void;
  /** 发送文本消息 */
  sendTextMessage: (message: string) => Promise<MessageType | void>;
  recallMessage: (msgId: number) => Promise<void>;

  /** 通过消息列表拿到对应的用户，组合为新数组 */
  combineMessageWithUser: (messages: MessageType[]) => Promise<MessageType[]>;
  findMessagesById: (msgId: number) => MessageType | undefined;
  getSendTime: (index: number) => string | undefined;
}

export const useChatStore = create<IChatStoreState>((set, get) => ({
  messages: [],
  pageCursor: undefined,
  onReceiveMessage: undefined,
  currentReplyingMsgId: undefined,
  inputRef: createRef(),
  listRef: createRef(),
  setOnReceiveMessage(cb) {
    set({
      onReceiveMessage: cb,
    });
  },
  setCurrentReplyingMsgId(msgId) {
    set(() => ({
      currentReplyingMsgId: msgId,
    }));
  },
  setListRef: (ref) => set(() => ({ listRef: ref })),
  setInputRef: (ref) => set(() => ({ inputRef: ref })),
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
  fetchMessages: async (pageSize = 50, roomId = 1) => {
    const res = await apis
      .getMsgList({ params: { pageSize, roomId, cursor: get().pageCursor } })
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
        title: `${message.fromUser.name}发送了一条消息`,
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
        message.message.body = `"${message.fromUser.name}"撤回了一条信息` as any;
      }
      return {
        messages: [...state.messages],
      };
    });
  },
  sendTextMessage: async (text) => {
    const { currentReplyingMsgId, addNewMessage, setCurrentReplyingMsgId } = get();
    try {
      const message = await apis
        .sendMsg({
          roomId: 1,
          msgType: MsgEnum.TEXT,
          body: {
            content: text,
            replyMsgId: currentReplyingMsgId,
          },
        })
        .send();
      addNewMessage(message);
      setCurrentReplyingMsgId(undefined);
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
        name: user.name,
      };
      return message;
    });
  },
  findMessagesById: (msgId) => {
    return get().messages.find((item) => item.message.id === msgId);
  },
  getSendTime: (index: number) => {
    if (index === 0) {
      return;
    }
    const curMsgTime = get().messages[index].message.sendTime;
    const lastMsgTime = get().messages[index - 1].message.sendTime;

    if (curMsgTime && curMsgTime - lastMsgTime >= 1000 * 60 * 10) {
      try {
        return dayjs(curMsgTime).calendar(dayjs(), {
          sameDay: 'HH:mm', // The same day ( Today at 2:30 AM )
          nextDay: '[明天] HH:mm', // The next day ( Tomorrow at 2:30 AM )
          nextWeek: '[下周]dd HH:mm', // The next week ( Sunday at 2:30 AM )
          lastDay: '[昨天] HH:mm', // The day before ( Yesterday at 2:30 AM )
          lastWeek: '[上周]dd HH:mm ', // Last week ( Last Monday at 2:30 AM )
          sameElse: 'YYYY/MM/DD/ HH:mm', // Everything else ( 7/10/2011 )
        });
      } catch (e) {}
    }
  },
}));
