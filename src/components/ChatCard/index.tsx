import React, { FC, useEffect, useMemo } from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import PopMenu from '../Popmenu';
import { MsgEnum } from '../../enums';
import TextMsg from './components/TextMsg';
import Recall from './components/Recall';
import ImageMsg from './components/ImageMsg';
import File from './components/File';
import Voice from './components/Voice';
import Video from './components/Video';
import { EmojiBody, ImageBody, MsgType, TextBody } from '../../services/types';
import Emoji from './components/Emoji';

type IProps = {
  username: string;
  messageBody: MsgType['body'];
  address: string;
  avatarUrl: string;
  type: MsgEnum;
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
}) => {
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
          overflow: 'hidden',
        },
        messageText: { color: 'white', fontSize: 15 },
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
          menus={[{ label: '复制' }, { label: '粘贴' }]}
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
      </View>
    </View>
  );
};

export default ChatCard;