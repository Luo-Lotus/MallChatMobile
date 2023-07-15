import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';

type IProps = {
  active: boolean;
  activeIcon: ImageSourcePropType;
  normalIcon: ImageSourcePropType;
};

const TabbarIcon = ({ active, activeIcon, normalIcon }: IProps) => (
  <Image style={{ width: 40, height: 40 }} source={active ? activeIcon : normalIcon} />
);

export default TabbarIcon;
