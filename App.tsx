import React from 'react';
import StackNavigator from './src/navigator/Stack';
import useWebsocket from './src/hooks/useWebsocket';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { ToastProvider } from './src/components/Toast/Index';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.extend(calendar);
dayjs.extend(updateLocale);
dayjs.locale('zh-cn');

const App = () => {
  useWebsocket();
  return (
    <ToastProvider>
      <ClickOutsideProvider>
        <StackNavigator />
      </ClickOutsideProvider>
    </ToastProvider>
  );
};

export default App;
