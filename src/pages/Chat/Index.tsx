import React, { FC, useEffect, useRef, useState } from 'react';
import { FlatList, ListRenderItemInfo, NativeScrollEvent, View } from 'react-native';

import ChatCard from '../../components/ChatCard';
import { useChatStore } from '../../stores/useChatStore';
import { MessageType } from '../../services/types';
import MessageInput from '../../components/MessageInput';
import useKeyboard from '../../hooks/useKeyboard';
import useUserStore from '../../stores/useUserStore';

const Chat: FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { initChat, fetchMessages, messages, setOnReceiveMessage, sendTextMessage, setListRef } =
    useChatStore();
  const { user } = useUserStore();
  const scrollViewRef = useRef<FlatList>(null);
  const currentContent = useRef<NativeScrollEvent>();

  const { keyboardHeight } = useKeyboard();

  useEffect(() => {
    if (keyboardHeight) {
      scrollTo('new');
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
    setListRef(scrollViewRef);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    scrollTo('history');
    setRefreshing(false);
  };

  const scrollTo = (action: 'history' | 'new' | 'init') => {
    console.log(action);

    setTimeout(() => {
      // 因为React Native 与原生通信有延迟， 不得不强制延迟执行时间
      switch (action) {
        case 'history':
          setTimeout(() => {
            const currentOffsetY = currentContent.current?.contentOffset.y;
            console.log(currentOffsetY);

            currentOffsetY &&
              scrollViewRef.current?.scrollToOffset({ offset: currentOffsetY - 300 });
          }, 500);
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
    <ChatCard
      key={message.message.id}
      username={message.fromUser.username}
      address={message.fromUser.locPlace}
      avatarUrl={message.fromUser.avatar}
      messageBody={message.message.body}
      type={message.message.type}
      isSelf={user?.uid === message.fromUser.uid}
      msgId={message.message.id}
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
        ListFooterComponentStyle={{ height: keyboardHeight || 90 }}
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
};

export default Chat;
