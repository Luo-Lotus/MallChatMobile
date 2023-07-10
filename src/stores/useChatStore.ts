import { create } from 'zustand';
import { MessageType } from '../services/types';
import apis from '../services/apis';
import useUsersStore from './useUsersStore';
import notificationManager from '../utils/NotificationManager';

export interface IChatStoreState {
  messages: MessageType[];
  pageCursor?: string;
  onReceiveMessage?: (message: MessageType) => void;
  setOnReceiveMessage: (cb: IChatStoreState['onReceiveMessage']) => void;
  init: () => Promise<void>;
  fetchMessages: () => Promise<void>;
  addNewMessage: (event: MessageType) => void;
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
  init: async () => {
    await get().fetchMessages();
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
        message: message.message.body.content,
        id: 1,
      });
    }
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
