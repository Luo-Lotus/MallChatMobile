import React, { FC, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Button from '../Button';
import useFadeLayoutAnimation from '../../hooks/animations/useFadeLayoutAnimation';
import Animated from 'react-native-reanimated';
import { MsgEnum } from '../../enums';
import { ReplyType } from '../../services/types';

type IProps = {
  onPress?: () => void;
  message?: Pick<ReplyType, 'body' | 'username' | 'type'>;
  layoutAnimation?: boolean;
  size?: 'small' | 'normal';
  style?: ViewStyle;
};

const ReplyCard: FC<IProps> = ({
  onPress,
  message,
  layoutAnimation = true,
  size = 'normal',
  style,
}) => {
  const { startEnter, startExit, animatedStyle } = useFadeLayoutAnimation();

  const styles = useMemo(() => {
    const matchSize = (normal: any, small: any) =>
      ({
        normal,
        small,
      }[size]);

    return StyleSheet.create({
      container: {
        justifyContent: 'space-between',
        backgroundColor: matchSize('#424656dd', '#424656'),
        borderRadius: 10,
        marginBottom: matchSize(10, 0),
        marginTop: matchSize(0, 5),
        overflow: 'hidden',
        alignSelf: 'flex-start',
      },
      press: {
        padding: matchSize(10, 5),
        paddingHorizontal: matchSize(15, 7),
      },
      text: {
        color: 'white',
        fontSize: matchSize(16, 12),
      },
    });
  }, []);

  useEffect(() => {
    if (message && layoutAnimation) {
      startEnter();
    }
  }, [message]);

  if (!message) {
    return null;
  }

  const renderMessageBody = () => {
    if (message.type) {
      return {
        [MsgEnum.TEXT]: message.body,
        [MsgEnum.RECALL]: null,
        [MsgEnum.IMAGE]: '[图片]',
        [MsgEnum.FILE]: '[文件]',
        [MsgEnum.VOICE]: '[语言]',
        [MsgEnum.VIDEO]: '[视频]',
        [MsgEnum.EMOJI]: '[表情]',
      }[message.type];
    }
    return message.body;
  };

  const renderContainer = (children: JSX.Element) =>
    layoutAnimation ? (
      <Animated.View style={[styles.container, animatedStyle, style]}>{children}</Animated.View>
    ) : (
      <View style={[styles.container, style]}>{children}</View>
    );

  return renderContainer(
    <Button
      onPress={() => {
        layoutAnimation ? startExit(() => onPress?.()) : onPress?.();
      }}
      style={styles.press}
    >
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{`${
        message.username
      }：${renderMessageBody()}`}</Text>
    </Button>,
  );
};

export default ReplyCard;
