// src/services/notificationService.ts

import {Alert, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';

export const setupPushNotifications = () => {
  // Request permission on iOS
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('Permission status:', enabled);
  };

  // Get FCM Token
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('FCM Token:', fcmToken);
  };

  // Handle foreground message
  const onMessageListener = messaging().onMessage(async remoteMessage => {
    console.log('Foreground Message:', remoteMessage);
    await displayNotification(remoteMessage);
  });

  // When app is opened from background
  const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
    remoteMessage => {
      if (remoteMessage) {
        console.log('Opened from background:', remoteMessage.notification);
        Alert.alert(
          'Opened from background!',
          remoteMessage.notification?.title ?? '',
        );
      }
    },
  );

  // When app is opened from quit state
  const getInitialNotification = async () => {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      console.log('Opened from quit state:', remoteMessage.notification);
      Alert.alert(
        'Opened from quit state!',
        remoteMessage.notification?.title ?? '',
      );
    }
  };

  // Display local notification
  const displayNotification = async (remoteMessage: any) => {
    await notifee.requestPermission();

    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId: 'default',
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  requestUserPermission();
  getFcmToken();
  getInitialNotification();

  return () => {
    onMessageListener(); // Unsubscribe
    onNotificationOpenedApp(); // Unsubscribe
  };
};
