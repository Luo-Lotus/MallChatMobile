import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../../navigator/Stack';
import useUserStore from '../../stores/useUserStore';
import { Alert, Button, Image, Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
  const { user, setToken, getToken, initUser, logout } = useUserStore();
  const [input, setInput] = useState('');
  const offset = useSharedValue(0);
  useEffect(() => {
    setInput(getToken() || '');
  }, []);

  const handleTokenInput = () => {
    setToken(input);
    Alert.alert('设置完毕，请重启应用');
  };

  const renderUserInfo = () => {
    if (!user) {
      return (
        <Text>
          {getToken() ? '请检查token是否有误' : '登陆请从网页端浏览器调试器中找到token并输入'}
        </Text>
      );
    }

    return (
      <View>
        <Image source={{ uri: user.avatar }} style={{ height: 100, width: 100 }}></Image>
        <Text>{`
        用户名:${user.name}
        uid: ${user.uid}
      `}</Text>
      </View>
    );
  };
  const gesture = Gesture.Pan()
    .onBegin(() => {
      console.log('开始触摸');
    })
    .onUpdate((e) => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const toDeg = (rad: number) => (rad / Math.PI) * 180;
      const P = 30 / 50;
      const y = toDeg(Math.atan(toRad(e.translationY * P))) * (1 / P);
      offset.value = y;
    })
    .onEnd(() => {
      console.log('结束触摸');
      offset.value = withTiming(0);
    })
    .onFinalize(() => {});

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: offset.value,
      },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        {renderUserInfo()}
        <Text>当前token:</Text>
        <TextInput
          style={{ borderWidth: 2, borderColor: 'gray', marginHorizontal: 20, borderRadius: 10 }}
          placeholder="请输入token"
          value={input}
          onChangeText={(text) => setInput(text)}
        />
        <Button onPress={handleTokenInput} title="确认" />
        <Button
          onPress={() => {
            logout();
            Alert.alert('请重启应用退出账号');
          }}
          title="退出登陆"
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default gestureHandlerRootHOC(Test);
