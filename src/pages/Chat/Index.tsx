/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  NativeScrollEvent,
  View,
} from 'react-native';

import MessageCard from '../../components/MessageCard';
import { useChatStore } from '../../stores/useChatStore';
import { MessageType } from '../../services/types';
import MessageInput from '../../components/MessageInput';
import useKeyboard from '../../hooks/useKeyboard';
import useUserStore from '../../stores/useUserStore';

function Chat(): JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const { initChat, fetchMessages, messages, setOnReceiveMessage, sendTextMessage } =
    useChatStore();
  const { user } = useUserStore();
  const scrollViewRef = useRef<FlatList>(null);
  const currentContent = useRef<NativeScrollEvent>();

  const { keyboardHeight, Keyboard } = useKeyboard();

  useEffect(() => {
    if (keyboardHeight) {
      scrollViewRef.current?.scrollToEnd();
    }
  }, [keyboardHeight]);

  useEffect(() => {
    setRefreshing(true);
    initChat().then(() => {
      scrollTo('init');
      setRefreshing(false);
    });
    setOnReceiveMessage(() => {
      scrollTo('new');
    });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    scrollTo('history');
    setRefreshing(false);
  };

  const scrollTo = (action: 'history' | 'new' | 'init', changedNumber = 17) => {
    console.log(action);

    // const currentOffsetY = currentContent.current?.contentOffset.y;
    setTimeout(() => {
      switch (action) {
        case 'history':
          scrollViewRef.current?.scrollToIndex({
            animated: true,
            index: 17,
          });
          break;
        case 'init':
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }, 0);
          break;
        case 'new':
          if (currentContent.current) {
            const { contentOffset, contentSize, layoutMeasurement } = currentContent.current;
            if (Math.abs(contentOffset.y + layoutMeasurement.height - contentSize.height) < 50) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }
      }
    }, 0);
  };

  const renderItem = ({ item: message }: ListRenderItemInfo<MessageType>) => (
    <MessageCard
      key={message.message.id}
      username={message.fromUser.username}
      address={message.fromUser.locPlace}
      avatarUrl={message.fromUser.avatar}
      message={message.message.body.content}
      isSelf={user?.uid === message.fromUser.uid}
    />
  );

  return (
    <>
      <FlatList<MessageType>
        style={{ backgroundColor: '#323644' }}
        data={messages}
        renderItem={renderItem}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={{ height: keyboardHeight || 80 }}
        initialNumToRender={20}
        keyExtractor={(item) => String(item.message.id)}
        onScroll={(event) => {
          currentContent.current = event.nativeEvent;
        }}
        ref={scrollViewRef}
      />
      <MessageInput onSendText={sendTextMessage} />
    </>
  );
}

export default Chat;
