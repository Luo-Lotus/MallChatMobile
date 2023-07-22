import React, { FC, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import lodash from 'lodash';
import PopMenu, { PopMenuItem } from '../Popmenu';
import { MsgEnum } from '../../enums';
import TextMsg from './components/TextMsg';
import Recall from './components/Recall';
import ImageMsg from './components/ImageMsg';
import File from './components/File';
import Voice from './components/Voice';
import Video from './components/Video';
import { EmojiBody, ImageBody, MsgType, TextBody } from '../../services/types';
import Emoji from './components/Emoji';
import { useClipboard } from '@react-native-clipboard/clipboard';
import { useChatStore } from '../../stores/useChatStore';
import useUserStore from '../../stores/useUserStore';
import ReplyCard from '../ReplyCard';
import { showToast } from '../Toast/Index';

type IProps = {
  username: string;
  messageBody: MsgType['body'];
  address: string;
  avatarUrl: string;
  type: MsgEnum;
  msgId: number;
  isSelf?: boolean;
};
// import { MarkdownView } from 'react-native-markdown-view';

const defaultAvatar = require('../../../assets/avatar.png');

const ChatCard: FC<IProps> = ({
  username,
  messageBody,
  address,
  avatarUrl,
  isSelf = false,
  type,
  msgId,
}) => {
  const [data, setString] = useClipboard();
  const { recallMessage, setCurrentReplyingMsgId, inputRef } = useChatStore();
  const { isLogin } = useUserStore();

  const menus = useMemo<PopMenuItem[]>(() => {
    const selfMenuItems = [
      {
        label: '撤回',
        onPress: () => {
          recallMessage(msgId);
        },
      },
    ];
    const otherMenuItems = [
      isLogin() && {
        label: '回复',
        onPress: () => {
          setCurrentReplyingMsgId(msgId);
          inputRef.current?.focus();
        },
      },
    ];
    return lodash.compact([
      {
        label: '复制',
        onPress: () => {
          setString((messageBody as TextBody).content);
          showToast({ message: '复制成功', type: 'normal' });
        },
      },
      ...(isSelf ? selfMenuItems : otherMenuItems),
    ]);
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
          [isSelf ? 'marginLeft' : 'marginRight']: 40,
          borderRadius: 20,
          padding: 10,
          paddingHorizontal: 15,
          overflow: 'hidden',
        },
        messageText: { color: 'white', fontSize: 18, fontWeight: '900' },
      }),
    [],
  );

  const renderMessageBody = () =>
    ({
      [MsgEnum.TEXT]: <TextMsg isSelf={isSelf} text={(messageBody as TextBody).content} />,
      [MsgEnum.RECALL]: null,
      [MsgEnum.IMAGE]: <ImageMsg imageBody={messageBody as ImageBody} />,
      [MsgEnum.FILE]: <File />,
      [MsgEnum.VOICE]: <Voice />,
      [MsgEnum.VIDEO]: <Video />,
      [MsgEnum.EMOJI]: <Emoji url={(messageBody as EmojiBody).url} />,
    }[type]);

  const shouldRenderBubble = () => [MsgEnum.TEXT].includes(type);
  const shouldRenderChildrenPressable = () => [MsgEnum.IMAGE].includes(type);

  if (type === MsgEnum.RECALL) {
    return <Recall text={messageBody as unknown as string} />;
  }

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
          menus={menus}
          style={{ alignSelf: isSelf ? 'flex-end' : 'flex-start', marginTop: 5 }}
          pressableProps={{
            unstable_pressDelay: 100,
            style: shouldRenderBubble() && styles.messageBubble,
            isRipple: shouldRenderBubble(),
          }}
          isChildrenPressable={shouldRenderChildrenPressable()}
        >
          {renderMessageBody()}
        </PopMenu>
        {messageBody.reply && (
          <ReplyCard
            message={messageBody.reply}
            size="small"
            layoutAnimation={false}
            style={{ alignSelf: isSelf ? 'flex-end' : 'flex-start' }}
          />
        )}
      </View>
    </View>
  );
};

export default ChatCard;
