import React, { FC } from 'react';
import { Pressable, PressableProps } from 'react-native';

export type IButtonProps = {
  isRipple?: boolean;
} & PressableProps;

const Button: FC<IButtonProps> = ({ isRipple = true, ...props }) => (
  <Pressable
    {...props}
    android_ripple={
      isRipple
        ? {
            color: '#00000033',
            borderless: false,
            foreground: true,
          }
        : undefined
    }
  />
);

export default Button;
