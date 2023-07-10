/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, RefreshControl, ScrollView } from 'react-native';

import MessageCard from '../../components/MessageCard';
import { useChatStore } from '../../stores/useChatStore';

function Chat(): JSX.Element {
  const [refreshing, setRefreshing] = useState(false);
  const { init, fetchMessages, messages, setOnReceiveMessage } = useChatStore();
  const scrollViewRef = useRef<ScrollView>(null);
  const currentContent = useRef<NativeScrollEvent>();

  console.log('已刷新');

  useEffect(() => {
    init().then(() => scrollTo('init'));
    setOnReceiveMessage(() => {
      scrollTo('new');
    });
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    scrollTo('history');
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const scrollTo = (action: 'history' | 'new' | 'init') => {
    console.log(action);

    setTimeout(() => {
      const currentOffsetY = currentContent.current?.contentOffset.y;
      switch (action) {
        case 'history':
          currentOffsetY && scrollViewRef.current?.scrollTo({ y: currentOffsetY - 300 });
          break;
        case 'init':
          scrollViewRef.current?.scrollToEnd({ animated: false });
          break;
        case 'new':
          if (currentContent.current) {
            const { contentOffset, contentSize, layoutMeasurement } = currentContent.current;
            if (Math.abs(contentOffset.y + layoutMeasurement.height - contentSize.height) < 50) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }
      }
    }, 500);
  };

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ref={scrollViewRef}
        style={{ backgroundColor: '#323644' }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onScroll={(event) => {
          currentContent.current = event.nativeEvent;
        }}
      >
        {messages.map((item) => (
          <MessageCard
            key={item.message.id}
            username={item.fromUser.username}
            address={item.fromUser.locPlace}
            avatarUrl={item.fromUser.avatar}
            message={item.message.body.content}
          />
        ))}
      </ScrollView>
    </>
  );
}

export default Chat;
