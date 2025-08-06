import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {navigate} from '../utils/NavigationUtils';
import QRCode from 'react-native-qrcode-svg';
import {getValue} from '../utils/keychainStorage';

import Constants from '../constants/Constants';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
}
const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const name = await getValue(Constants.USER_NAME);
      const phone = await getValue(Constants.MOBILE_NUMBER);
      const email = await getValue(Constants.EMAIL);
      const userInfo: UserInfo = {
        name: name || '',
        phone: phone || '',
        email: email || '',
      };
      setUserData(userInfo);
      console.log('User Info:', userInfo);
    };
    fetchUser();
  }, []);

  const qrValue = userData ? JSON.stringify(userData) : '';
  console.log('qrValue', qrValue);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Your Profile</Text>
      {userData && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>QR Code:</Text>
          <QRCode value={JSON.stringify(userData)} size={200} />
        </View>
      )}
      <Button
        title="SalonScreeb"
        onPress={() => navigate('SalonDetailScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {fontSize: 20, marginBottom: 20},
  qrLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  qrContainer: {
    marginBottom: 20,
  },
});

export default ProfileScreen;
