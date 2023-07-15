import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import React, { FC } from 'react';
import Button from '../../components/Button';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const AnimatedButton = Animated.createAnimatedComponent(Button);

const TabbarButton: FC<BottomTabBarButtonProps> = (props) => {
  const sharedValue = useSharedValue(0);

  return <AnimatedButton {...props} />;
};

export default TabbarButton;
