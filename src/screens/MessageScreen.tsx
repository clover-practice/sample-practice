import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import KeyboardAvoidingWrapper from '../utils/KeyboardAvoidingWrapper';

const MessageScreen = () => {
  return (
    <View style={styles.safeArea}>
      <CustomHeader
        title="Message"
        showBack={true}
        onBackPress={() => goBack()}
      />
      <KeyboardAvoidingWrapper containerStyle={styles.containerStyle}>
        <Text>Anil</Text>
      </KeyboardAvoidingWrapper>
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerStyle: {
    paddingHorizontal: 10,

    paddingBottom: 60,
  },
});
