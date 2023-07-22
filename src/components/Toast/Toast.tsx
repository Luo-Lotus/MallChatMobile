import React, { FC, useEffect } from 'react';
import { Text } from 'react-native';
import { ToastType } from './Index';
import useFadeLayoutAnimation from '../../hooks/animations/useFadeLayoutAnimation';
import Animated from 'react-native-reanimated';

const Toast: FC<ToastType> = ({ message, type }) => {
  const { startEnter, startExit, animatedStyle } = useFadeLayoutAnimation();

  useEffect(() => {
    startEnter();
    setTimeout(() => {
      startExit();
    }, 3000);
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          backgroundColor: '#000000aa',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
        },
      ]}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
        }}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

export default Toast;
