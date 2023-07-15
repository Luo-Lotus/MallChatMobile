import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscript = Keyboard.addListener('keyboardDidHide', (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    return () => {
      Keyboard.removeSubscription?.(showSubscription);
      Keyboard.removeSubscription?.(hideSubscript);
    };
  }, []);

  return { keyboardHeight, Keyboard };
};

export default useKeyboard;
