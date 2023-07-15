import { create } from 'zustand';
import { UserInfoType } from '../services/types';
import storage from '../utils/storage';
import StorageKey from '../constants/StorageKey';
import { chatWebSocket } from '../hooks/useWebsocket';
import { WsRequestMsgType, WsResponseMessageType } from '../services/wsType';
import { ChatWebsocketEvent } from '../utils/ChatWebsocket';

interface IUserStore {
  user: UserInfoType | null;
  initUser: () => void;
  fetchUserInfo: () => void;
  fetchBadge: () => void;
  getToken: () => string | undefined;
  setToken: (token: string) => void;
  login: () => void;
  logout: () => void;
  setUser: (user: UserInfoType) => void;
}

const useUserStore = create<IUserStore>((set, get) => ({
  user: null,
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
  },
  fetchUserInfo: () => {},
  fetchBadge: () => {},
  getToken: () => storage.getString(StorageKey.USER_TOKEN),
  setToken: (token) => {
    storage.set(StorageKey.USER_TOKEN, token);
  },
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
