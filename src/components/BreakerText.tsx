import React, { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BreakerTextProps {
  text: string;
}

const BreakerText: FC<BreakerTextProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default BreakerText;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    paddingHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#ccc',
  },
  text: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#666',
  },
});
