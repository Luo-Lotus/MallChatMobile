import React, { FC, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import useKeyboard from '../../hooks/useKeyboard';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Button from '../Button';
import useUserStore from '../../stores/useUserStore';
import useReplyMessage from './hooks/useReplyMessage';
import ReplyCard from '../ReplyCard/index';
import { useChatStore } from '../../stores/useChatStore';

type IProps = {
  onSendText?: (text: string) => void;
};

const MessageInput: FC<IProps> = ({ onSendText }) => {
  const [text, setText] = useState('');
  const { keyboardHeight, Keyboard } = useKeyboard();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { isLogin } = useUserStore();
  const { message, cancelReply } = useReplyMessage();
  const { inputRef } = useChatStore();
  const sharedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -sharedValue.value }],
    }),
    [keyboardHeight],
  );

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current?.blur();
    });
    return () => Keyboard.removeSubscription(subscription);
  }, []);

  useEffect(() => {
    sharedValue.value = withSpring(keyboardHeight && keyboardHeight - bottomTabBarHeight, {
      mass: 0.5,
      damping: 11,
      stiffness: 200,
    });
  }, [keyboardHeight]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          margin: 20,
        },
        inputWrapper: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          padding: 10,
          backgroundColor: '#424656',
          borderRadius: 20,
        },
        input: {
          backgroundColor: 'white',
          flex: 1,
          paddingLeft: 10,
          borderRadius: 10,
          fontSize: 16,
        },
        sendButton: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
          marginLeft: 10,
          backgroundColor: '#353845',
          color: 'white',
          borderRadius: 10,
        },
        sendButtonText: {
          color: 'white',
        },
        block: {
          height: 100,
        },
      }),
    [],
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ReplyCard message={message} onPress={cancelReply} />
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          multiline={true}
          selectionColor={'#353845'}
          style={styles.input}
        />
        <Button
          style={styles.sendButton}
          disabled={!text || !isLogin()}
          onPress={() => {
            onSendText?.(text);
            setText('');
          }}
        >
          <Text style={styles.sendButtonText}>发送</Text>
        </Button>
      </View>
    </Animated.View>
  );
};

export default MessageInput;
