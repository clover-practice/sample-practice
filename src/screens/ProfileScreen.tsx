import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {navigate} from '../utils/NavigationUtils';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Your Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 20, marginBottom: 20},
});

export default ProfileScreen;
