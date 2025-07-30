import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

import CustomHeader from '../components/CustomHeader';
import {goBack, navigate} from '../utils/NavigationUtils';
import colors from '../constants/colors';
import AppTextInput from '../components/AppTextInput';
import KeyboardAvoidingWrapper from '../utils/KeyboardAvoidingWrapper';

const {width} = Dimensions.get('window');
const SettingsScreen = () => {
  return (
    <View style={styles.safeArea}>
      <CustomHeader
        title="Setting"
        showBack={true}
        onBackPress={() => goBack()}
      />
      <KeyboardAvoidingWrapper containerStyle={styles.containerStyle}>
        <Text>Setting</Text>
      </KeyboardAvoidingWrapper>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerStyle: {
    paddingHorizontal: 10,
    backgroundColor: 'red',
    paddingBottom: 60,
  },
});
