import React from 'react';
import StackNavigator from './src/navigator/Stack';
import useWebsocket from './src/hooks/useWebsocket';
import { ClickOutsideProvider } from 'react-native-click-outside';

const App = () => {
  useWebsocket();
  return (
    <ClickOutsideProvider>
      <StackNavigator />
    </ClickOutsideProvider>
  );
};

export default App;
