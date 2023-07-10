import React from 'react';
import StackNavigator from './src/navigator/Stack';
import useWebsocket from './src/hooks/useWebsocket';

const App = () => {
  useWebsocket();
  return <StackNavigator />;
};

export default App;
