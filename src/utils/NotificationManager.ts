import { AppState, PermissionsAndroid, Platform } from 'react-native';
import PushNotification, {
  Importance,
  PushNotificationObject,
} from 'react-native-push-notification';

class NotificationManager {
  constructor(public channelId = 'mallChat-message-channel') {
    this.configNotification();
    this.getPermission();
    this.createChannel();
  }

  configNotification = () => {
    // Must be outside of any component LifeCycle (such as `componentDidMount`).
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: Platform.OS === 'ios',
    });
  };

  hasPermission = () => PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  getPermission = async () => {
    const hasPermission = await this.hasPermission();
    if (!hasPermission) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: '授权通知权限',
          message: '授权后有每当有新消息会在通知栏进行显示',
          buttonNeutral: '稍后再说',
          buttonNegative: '拒绝',
          buttonPositive: '统一',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('已获得权限');
      } else {
        console.log('获取权限失败');
      }
    }
  };

  createChannel = () => {
    PushNotification.channelExists(this.channelId, (exist) => {
      if (!exist) {
        PushNotification.createChannel(
          {
            channelId: this.channelId, // (required)
            channelName: 'mallChannel chat channel', // (required)
            channelDescription: 'mallChannel chat channel', // (optional) default: undefined.
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH,
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          (created) => console.log(`已创建推送频道 '${created}'`),
        );
      }
    });
  };

  pushNotification = (params: Partial<PushNotificationObject>, clearOther = true) => {
    console.log(AppState.currentState);

    if (AppState.currentState !== 'active') {
      console.log('推送');

      PushNotification.localNotification({
        channelId: this.channelId,
        title: '', // 通知标题
        message: '', // 通知正文
        bigText: '', // 扩展后显示的大文本内容
        color: 'red', // 通知的颜色，可以在 Android 上使用
        vibrate: false, // 是否震动
        playSound: true, // 是否播放提示音
        soundName: 'default', // 提示音文件名
        priority: 'max',
        ...params,
      });
    }
  };
}
const notificationManager = new NotificationManager();

export default notificationManager;
