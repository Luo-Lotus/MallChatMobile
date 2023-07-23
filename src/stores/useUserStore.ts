import { create } from 'zustand';
import { BadgeType, UserInfoType } from '../services/types';
import storage from '../utils/storage';
import StorageKey from '../constants/StorageKey';
import { chatWebSocket } from '../hooks/useWebsocket';
import { WsRequestMsgType, WsResponseMessageType } from '../services/wsType';
import { ChatWebsocketEvent } from '../utils/ChatWebsocket';
import apis from '../services/apis';

interface IUserStore {
  user: UserInfoType | null;
  badges: BadgeType[];
  initUser: () => void;
  fetchUserInfo: () => void;
  fetchBadge: () => void;
  getToken: () => string | undefined;
  setToken: (token: string) => void;
  isLogin: () => boolean;
  login: () => void;
  logout: () => void;
  setUser: (user: UserInfoType) => void;
}

const useUserStore = create<IUserStore>((set, get) => ({
  user: null,
  badges: [],
  initUser: () => {
    chatWebSocket.addListener(ChatWebsocketEvent[WsResponseMessageType.LoginSuccess], (data) => {
      console.log('登陆成功', data);
      get().setUser(data);
    });

    chatWebSocket.addListener(ChatWebsocketEvent[WsResponseMessageType.TokenExpired], (data) => {
      console.log('tokne失效', data);
      get().logout();
    });

    chatWebSocket.addListener(ChatWebsocketEvent.OPEN, () => {
      get().login();
    });
    get().fetchBadge();
  },
  fetchUserInfo: () => {},
  fetchBadge: async () => {
    const res = await apis.getBadgeList().send();
    set(() => ({
      badges: res,
    }));
  },
  getToken: () => storage.getString(StorageKey.USER_TOKEN),
  setToken: (token) => {
    storage.set(StorageKey.USER_TOKEN, token);
  },
  isLogin: () => !!get().user,
  login: () => {
    const token = get().getToken();
    token && chatWebSocket.send({ type: WsRequestMsgType.Authorization, data: { token } });
  },
  logout: () => {
    storage.delete(StorageKey.USER_TOKEN);
  },
  setUser: (user) => {
    set(() => ({
      user,
    }));
  },
}));

export default useUserStore;
