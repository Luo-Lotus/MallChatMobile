import React, { useEffect } from 'react';
import { Button, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '../../../App';
import { useChatStore } from '../../stores/useChatStore';

const Test = ({ navigation }: NativeStackScreenProps<StackParamList>) => {
  const { setCount, count } = useChatStore();

  return (
    <>
      <Text>测试页面</Text>
      <Button onPress={() => navigation.push('Chat')} title="跳转到Chat" />
      <Button
        onPress={() => {
          setCount(3);
        }}
        title={`${count}`}
      />
      <Button onPress={() => navigation.push('Home')} title={`${count}`} />
    </>
  );
};

export default Test;
