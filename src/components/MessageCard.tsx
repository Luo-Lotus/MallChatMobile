import React, { FC, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import RTNCalculator from 'rtn-calculator/js/NativeCalculator';

type IProps = {
  username: string;
  message: string;
  address: string;
  avatarUrl: string;
};

const MessageCard: FC<IProps> = ({ username, message, address, avatarUrl }) => {
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
          flexDirection: 'row',
          alignItems: 'flex-start',
          margin: 10,
        },
        avatarWrapper: {},
        avatarImage: {
          height: 40,
          width: 40,
          borderRadius: 40,
          marginRight: 10,
          marginLeft: 5,
          marginVertical: 5,
        },
        contentWrapper: {
          flex: 1,
        },
        username: {},
        usernameText: {
          fontSize: 12,
          color: '#999',
        },
        messagePop: {
          alignSelf: 'flex-start',
          backgroundColor: '#383C4B',
          padding: 10,
          paddingHorizontal: 15,
          borderTopLeftRadius: 5,
          borderRadius: 20,
          marginTop: 5,
        },
        messageText: { color: 'white', fontSize: 15 },
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {/** @ts-ignore */}
        <Image style={styles.avatarImage} src={avatarUrl} />
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.username}>
          <Text style={styles.usernameText}>{`${username} (${address || '未知'})`}</Text>
        </View>
        <View style={styles.messagePop}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      </View>
    </View>
  );
};

export default MessageCard;
