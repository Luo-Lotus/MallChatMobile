import React, { FC, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import PopMenu from './Popmenu';
type IProps = {
  username: string;
  message: string;
  address: string;
  avatarUrl: string;
  isSelf?: boolean;
};
// import { MarkdownView } from 'react-native-markdown-view';

const defaultAvatar = require('../../assets/avatar.png');

const MessageCard: FC<IProps> = ({ username, message, address, avatarUrl, isSelf = false }) => {
  useEffect(() => {
    // RTNCalculator?.add(Math.PI, 0.1).then((res) => {
    //   console.log('js计算结果', Math.PI + 0.1);
    //   console.log(RTNCalculator?.myEquals('哈哈', '哈哈'));
    //   console.log('java计算结果', res);
    // });
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: isSelf ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          margin: 10,
        },
        avatarWrapper: {},
        avatarImage: {
          height: 40,
          width: 40,
          borderRadius: 40,
          [isSelf ? 'marginLeft' : 'marginRight']: 10,
          marginVertical: 5,
        },
        contentWrapper: {
          flex: 1,
        },
        username: {},
        usernameText: {
          fontSize: 12,
          color: '#999',
          textAlign: isSelf ? 'right' : 'left',
        },
        messageBubble: {
          backgroundColor: isSelf ? '#1D90F5' : '#383C4B',
          [isSelf ? 'borderTopRightRadius' : 'borderTopLeftRadius']: 5,
          borderRadius: 20,
          padding: 10,
          paddingHorizontal: 20,
          marginTop: 5,
          overflow: 'hidden',
        },
        messageText: { color: 'white', fontSize: 15 },
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {/** @ts-ignore */}
        <Image style={styles.avatarImage} src={avatarUrl} defaultSource={defaultAvatar} />
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.username}>
          <Text style={styles.usernameText}>{`${username} (${address || '未知'})`}</Text>
        </View>
        <PopMenu
          menus={[{ label: '复制' }, { label: '粘贴' }]}
          style={{ alignSelf: isSelf ? 'flex-end' : 'flex-start' }}
          pressableProps={{
            unstable_pressDelay: 100,
            style: styles.messageBubble,
          }}
        >
          <Text style={styles.messageText}>{message}</Text>
        </PopMenu>
      </View>
    </View>
  );
};

export default MessageCard;
