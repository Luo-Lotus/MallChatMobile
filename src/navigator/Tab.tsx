import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Test from '../pages/Test/Index';
import Chat from '../pages/Chat/Index';
import { Image, Pressable, View } from 'react-native';
import TabbarIcon from './components/TabbarIcon';
import Button from '../components/Button';

const messageIcon = require('../../assets/message.png');
const messageActiveIcon = require('../../assets/message-active.png');
const mineIcon = require('../../assets/mine.png');
const mineActiveIcon = require('../../assets/mine-active.png');

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#272936',
          borderTopWidth: 0,
          height: 80,
        },
        tabBarActiveTintColor: 'white',
        tabBarShowLabel: false,
        // tabBarHideOnKeyboard: true,

        tabBarButton: Button,
      }}
    >
      <Tab.Screen
        name="Mine"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabbarIcon active={focused} activeIcon={mineActiveIcon} normalIcon={mineIcon} />
          ),
        }}
        component={Test}
      />
      <Tab.Screen
        name="Chat"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabbarIcon active={focused} activeIcon={messageActiveIcon} normalIcon={messageIcon} />
          ),
        }}
        component={Chat}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
