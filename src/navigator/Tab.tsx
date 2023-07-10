import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Test from '../pages/Test/Index';
import Chat from '../pages/Chat/Index';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="TestBar" component={Test} />
      <Tab.Screen name="TestBar2" component={Chat} />
      <Tab.Screen name="TestBar3" component={Test} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
