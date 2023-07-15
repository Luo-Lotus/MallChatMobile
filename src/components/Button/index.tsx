import React, { FC } from 'react';
import { Pressable, PressableProps } from 'react-native';

const Button: FC<PressableProps> = (props) => (
  <Pressable
    {...props}
    android_ripple={{
      color: '#00000033',
      borderless: false,
      foreground: true,
    }}
  />
);

export default Button;
