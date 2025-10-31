// App.tsx
import React, {useEffect} from 'react';
import {View, Text, Alert, PermissionsAndroid, Platform} from 'react-native';

import AppNavigator from './src/Navigations/AppNavigator';
import {CartProvider} from './src/contexts/CartContext';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
import {setupPushNotifications} from './src/utils/notificationService';

import messaging, {getToken} from '@react-native-firebase/messaging';
const App = () => {
  useEffect(() => {
    // requestUserPermission();
    setupPushNotifications();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission granted:', authStatus);
      getFcmToken();
    } else {
      console.log('Notification permission denied');
    }
  };

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token New : ', token);
      // 🔸 Send this token to your backend for push notifications
    } catch (error) {
      console.error('Error fetching FCM token:', error);
    }
  };
  // Foreground: handle manually and show local notification
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Message:', remoteMessage);

      // await displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  // Background: when user taps notification
  useEffect(() => {
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification opened from background:',
          remoteMessage.notification,
        );
        Alert.alert(
          'Opened from background!',
          remoteMessage.notification?.title ?? '',
        );
      }
    });

    return unsubscribe;
  }, []);

  return (
    // <SafeAreaProvider>
    <CartProvider>
      <AppNavigator />
    </CartProvider>
    // </SafeAreaProvider>
  );
};

export default App;
