import React, { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Recall: FC<{ text: string }> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  text: {
    color: 'gray',
    fontSize: 12,
  },
});

export default Recall;
