import { useEffect } from 'react';
import ChatWebsocket, { ChatWebsocketEvent } from '../utils/ChatWebsocket';
import { useChatStore } from '../stores/useChatStore';
import { WsResponseMessageType } from '../services/wsType';
import useUsersStore from '../stores/useUsersStore';

const WEBSOCKET_URL = 'wss://api.mallchat.cn/websocket';

const chatWebSocket = new ChatWebsocket(WEBSOCKET_URL);

const useWebsocket = () => {
  const { addNewMessage } = useChatStore();
  const { cachedUsers, init } = useUsersStore();

  useEffect(() => {
    console.log(cachedUsers.map((_) => _.name));
  }, [cachedUsers]);

  useEffect(() => {
    init();
    chatWebSocket.addListener(
      ChatWebsocketEvent[WsResponseMessageType.ReceiveMessage],
      addNewMessage,
    );
    chatWebSocket.addListener(ChatWebsocketEvent[WsResponseMessageType.WSMsgMarkItem], (data) => {
      console.log('收到发送的消息', data);
    });

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
