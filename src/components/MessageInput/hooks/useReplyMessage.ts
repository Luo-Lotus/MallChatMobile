import { useEffect, useMemo } from 'react';
import { useChatStore } from '../../../stores/useChatStore';
import { TextBody } from '../../../services/types';

const useReplyMessage = () => {
  const { setCurrentReplyingMsgId, currentReplyingMsgId, findMessagesById } = useChatStore();
  const message = useMemo(() => {
    const item = findMessagesById(currentReplyingMsgId || -1);
    if (!item) {
      return undefined;
    }
    return {
      body: (item.message.body as TextBody)?.content,
      username: item.fromUser.username,
      type: item.message.type,
    };
  }, [currentReplyingMsgId]);

  const cancelReply = () => {
    setCurrentReplyingMsgId(undefined);
  };

  return {
    message,
    cancelReply,
  };
};

export default useReplyMessage;
