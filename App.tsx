import React from 'react';
import StackNavigator from './src/navigator/Stack';
import useWebsocket from './src/hooks/useWebsocket';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { ToastProvider } from './src/components/Toast/Index';

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
