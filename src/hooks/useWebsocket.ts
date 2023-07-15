import { useEffect } from 'react';
import ChatWebsocket, { ChatWebsocketEvent } from '../utils/ChatWebsocket';
import { useChatStore } from '../stores/useChatStore';
import useUsersStore from '../stores/useUsersStore';
import useUserStore from '../stores/useUserStore';

const WEBSOCKET_URL = 'wss://api.mallchat.cn/websocket';

export const chatWebSocket = new ChatWebsocket(WEBSOCKET_URL);

const useWebsocket = () => {
  const { initChat } = useChatStore();
  const { initUsers } = useUsersStore();
  const { initUser } = useUserStore();

  useEffect(() => {
    initUsers();
    initUser();
    initChat();

    chatWebSocket.addListener(ChatWebsocketEvent.OPEN, () => {
      console.log('连接成功');
    });
    chatWebSocket.addListener(ChatWebsocketEvent.CLOSE, (event) => {
      console.log('连接断开', event);
    });
    chatWebSocket.addListener(ChatWebsocketEvent.ERROR, (event) => {
      console.log('连接错误', event);
    });

    return () => chatWebSocket.clearAll();
  }, []);
};

export default useWebsocket;
