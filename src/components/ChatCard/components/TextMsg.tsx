import React, { FC } from 'react';
import { Text } from 'react-native';

const TextMsg: FC<{ text: string; isSelf: boolean }> = ({ text, isSelf }) => {
  return (
    <Text
      style={{
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
      }}
    >
      {text}
    </Text>
  );
};

export default TextMsg;
