import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from '../pages/Chat/Index';
import Test from '../pages/Test/Index';
import { View } from 'react-native';
import TabNavigator from './Tab';

const Stack = createNativeStackNavigator();

export type StackParamList = {
  Test: undefined;
  Chat: undefined;
  Home: undefined;
};

const StackNavigator = () => {
  return (
    <NavigationContainer<StackParamList>>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          animation: 'slide_from_right',
          navigationBarColor: '#272A37', //底部颜色
          statusBarColor: '#272A37',
          headerStyle: {
            backgroundColor: '#272A37',
          },
          header(props) {
            console.log(props);

            return <View style={{ height: 100 }}></View>;
          },
        }}
      >
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
          component={TabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
