import { WsReqMsgContentType, WsRequestMsgType } from './../services/wsType';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { WsResMsgContentType, WsResponseMessageType } from '../services/wsType';
import BackgroundTimer, { IntervalId } from 'react-native-background-timer';

export const ChatWebsocketEvent = {
  ERROR: 'error',
  CLOSE: 'close',
  OPEN: 'open',
  [WsResponseMessageType.LoginQrCode]: 'LoginQrCode',
  [WsResponseMessageType.WaitingAuthorize]: 'WaitingAuthorize',
  [WsResponseMessageType.LoginSuccess]: 'LoginSuccess',
  [WsResponseMessageType.ReceiveMessage]: 'ReceiveMessage',
  [WsResponseMessageType.OnOffLine]: 'OnOffLine',
  [WsResponseMessageType.TokenExpired]: 'TokenExpired',
  [WsResponseMessageType.InValidUser]: 'InValidUser',
  [WsResponseMessageType.WSMsgMarkItem]: 'WSMsgMarkItem',
  [WsResponseMessageType.WSMsgRecall]: 'WSMsgRecall',
};

export default class ChatWebsocket extends EventEmitter {
  private websocketInst?: WebSocket;
  private timer: IntervalId = 0;

  constructor(private url: string) {
    super();
    this.init();
    this.heartBeat();
    console.log('已初始化');
  }

  private dispatchMessage = (data: WsResMsgContentType<any>) => {
    switch (data.type) {
      case WsResponseMessageType.LoginQrCode:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.LoginQrCode], data.data);
        break;
      case WsResponseMessageType.WaitingAuthorize:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.WaitingAuthorize], data.data);
        break;
      case WsResponseMessageType.LoginSuccess:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.LoginSuccess], data.data);
        break;
      case WsResponseMessageType.ReceiveMessage:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.ReceiveMessage], data.data);
        break;
      case WsResponseMessageType.OnOffLine:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.OnOffLine], data.data);
        break;
      case WsResponseMessageType.TokenExpired:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.TokenExpired], data.data);
        break;
      case WsResponseMessageType.InValidUser:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.InValidUser], data.data);
        break;
      case WsResponseMessageType.WSMsgMarkItem:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.WSMsgMarkItem], data.data);
        break;
      case WsResponseMessageType.WSMsgRecall:
        this.emit(ChatWebsocketEvent[WsResponseMessageType.WSMsgRecall], data.data);
        break;
    }
  };

  private init = () => {
    this.websocketInst = new WebSocket(this.url);
    this.websocketInst.onmessage = (event) => {
      this.dispatchMessage(JSON.parse(event.data));
    };
    this.websocketInst.onopen = () => {
      this.emit(ChatWebsocketEvent.OPEN);
    };

    this.websocketInst.onclose = (event) => {
      this.emit(ChatWebsocketEvent.CLOSE, event);
      this.reconnection();
    };
    this.websocketInst.onerror = (event) => () => {
      this.emit(ChatWebsocketEvent.ERROR, event);
      this.reconnection();
    };
  };

  private isClosed = () => (this.websocketInst?.readyState || 3) === 3;

  private reconnection = () => {
    if (this.isClosed()) {
      this.init();
    }
  };

  private heartBeat = () => {
    // BackgroundTimer 后台运行，但是系统会有杀后台的情况 所以不是很有用
    this.timer = BackgroundTimer.setInterval(() => {
      if (this.websocketInst?.readyState === 1) {
        this.send({ type: WsRequestMsgType.HeartBeatDetection });
      }
    }, 10000);
  };

  clearHearBeat = () => {
    BackgroundTimer.clearInterval(this.timer);
  };

  clearAll = () => {
    this.removeAllListeners();
    this.clearHearBeat();
  };

  public send(msg: WsReqMsgContentType) {
    this.websocketInst?.send(JSON.stringify(msg));
  }
}
