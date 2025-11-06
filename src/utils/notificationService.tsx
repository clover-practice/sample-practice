import {Alert, Linking, Platform} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
  AndroidAction,
} from '@notifee/react-native';
import {navigate} from './NavigationUtils';
import navigationString from '../constants/navigationString';
import axios from 'axios';
import {NotificationDataNew} from '../types/NotificationTypes';

// 👇 Extend interfaces for custom FCM data
interface ExtendedNotification extends FirebaseMessagingTypes.Notification {
  link?: string;
}

interface ExtendedRemoteMessage extends FirebaseMessagingTypes.RemoteMessage {
  notification?: ExtendedNotification;
  data?: {
    type?: string;
    action1?: string;
    action2?: string;
    sender?: string;
    amount?: string;
  };
}

export const setupPushNotifications = () => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('🔐 Permission granted:', enabled);
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('📱 FCM Token:', fcmToken);
  };

  // 🔔 Foreground message listener
  const onMessageListener = messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message:', remoteMessage);
    await displayCustomNotification(remoteMessage as ExtendedRemoteMessage);
  });

  // 🔔 App opened from background by tapping the notification
  const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
    remoteMessage => {
      const msg = remoteMessage as ExtendedRemoteMessage;
      if (msg.notification?.link) {
        Linking.openURL(msg.notification.link);
      } else {
        Alert.alert(
          msg.notification?.title ?? '',
          msg.notification?.body ?? '',
        );
      }
    },
  );

  // 🔔 App launched from quit state by tapping the notification
  const getInitialNotification = async () => {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      const msg = remoteMessage as ExtendedRemoteMessage;
      if (msg.notification?.link) {
        Linking.openURL(msg.notification.link);
      }
    }
  };

  requestUserPermission();
  getFcmToken();
  getInitialNotification();

  return () => {
    onMessageListener();
    onNotificationOpenedApp();
  };
};

// ✅ Displays custom rich notification with two buttons
const displayCustomNotification = async (
  remoteMessage: ExtendedRemoteMessage,
) => {
  const {title, body} = remoteMessage.notification || {};
  const {action1, action2, sender, amount} = remoteMessage.data || {};

  await notifee.requestPermission();

  // 🔧 Create notification channel
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // 🧩 Define button actions dynamically
  const actions: AndroidAction[] = [
    {
      title: action1 || 'Double It',
      pressAction: {id: 'double_it'},
    },
    {
      title: action2 || 'Take It',
      pressAction: {id: 'take_it'},
    },
  ];

  // 🪄 Custom title/body formatting (like your screenshot)
  const displayTitle =
    title || `${sender || 'Someone'} sent you $${amount || '100.00'}`;
  const displayBody =
    body ||
    'Do you want to take it or double it and give it to the next person?';

  // 📱 Show notification
  await notifee.displayNotification({
    title: displayTitle,
    body: displayBody,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // must exist in res/mipmap-*
      importance: AndroidImportance.HIGH,
      style: {
        type: AndroidStyle.BIGTEXT,
        text: displayBody,
      },
      actions,
      pressAction: {id: 'default'},
    },
  });
};

// ✅ Handle button click events (Double It / Take It)
notifee.onForegroundEvent(async ({type, detail}) => {
  console.log('FORE GROUND MESSAGE');
  if (type === EventType.ACTION_PRESS) {
    switch (detail.pressAction?.id) {
      case 'double_it':
        console.log('🔥 User chose to DOUBLE it!');
        Alert.alert('You chose to double it!');
        // navigate(navigationString.SALON_DETAILS);
        const data: NotificationDataNew = {
          notificationId: '12345',
          userId: 'user_001',
        };

        updateClickStatus(data);
        navigate(navigationString.EDIT_PROFILE);
        break;

      case 'take_it':
        console.log('💰 User chose to TAKE it!');
        Alert.alert('You chose to take it!');
        break;

      default:
        break;
    }
  }
});

// 🟡 Handle button presses even when app is closed
notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('BACKGROUND MESSAGE');
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'accept') {
    console.log('✅ User pressed ACCEPT from background');

    const data: NotificationDataNew = {
      notificationId: '12345',
      userId: 'user_001',
    };

    updateClickStatus(data);
    navigate(navigationString.EDIT_PROFILE);
  } else if (
    type === EventType.ACTION_PRESS &&
    detail.pressAction?.id === 'reject'
  ) {
    console.log('❌ User pressed REJECT from background');
  }
});

async function updateClickStatus(data?: NotificationDataNew): Promise<void> {
  if (!data?.notificationId || !data?.userId) {
    console.warn('Missing notificationId or userId in notification data');
    return;
  }

  // const payload = {
  //   notificationId: data.notificationId,
  //   userId: data.userId,
  // };
  const payload = JSON.stringify({
    notificationId: '123456',
    userId: '2345',
  });
  try {
    await axios.post(
      'http://192.168.22.34:8080/api/notifications/clickOnMessage',
      payload,
      {
        headers: {'Content-Type': 'application/json'},
      },
    );
    console.log('✅ Click status updated successfully');
  } catch (error: any) {
    console.error('❌ Error updating click status:', error.message);
  }
}

export function initializeFCMHandlers(): void {
  // 1️⃣ When the app is opened from background (notification tapped)
  messaging().onNotificationOpenedApp(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('📬 Notification opened from background:', remoteMessage);
      await updateClickStatus(remoteMessage.data as NotificationDataNew);
    },
  );

  // 2️⃣ When the app is opened from a quit (killed) state
  messaging()
    .getInitialNotification()
    .then(async remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 Notification opened from quit state:', remoteMessage);
        await updateClickStatus(remoteMessage.data as NotificationDataNew);
      }
    });

  // 3️⃣ Background message handler (runs even if app not visible)
  messaging().setBackgroundMessageHandler(
    async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('🕐 Background FCM message received:', remoteMessage);
      // You can handle silent updates or analytics tracking here if needed
    },
  );
}

// ✅ Foreground button actions
// notifee.onForegroundEvent(async ({type, detail}) => {
//   if (type === EventType.ACTION_PRESS) {
//     if (detail.pressAction?.id === 'accept') {
//       console.log('✅ User pressed ACCEPT');
//       navigate(navigationString.SALON_DETAILS);
//     } else if (detail.pressAction?.id === 'reject') {
//       console.log('❌ User pressed REJECT');
//       Alert.alert('Booking rejected');
//     }
//   }
// });

// // src/services/notificationService.ts

// import {Alert, Platform} from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import notifee, {AndroidImportance} from '@notifee/react-native';

// export const setupPushNotifications = () => {
//   // Request permission on iOS
//   const requestUserPermission = async () => {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//     console.log('Permission status:', enabled);
//   };

//   // Get FCM Token
//   const getFcmToken = async () => {
//     const fcmToken = await messaging().getToken();
//     console.log('FCM Token:', fcmToken);
//   };

//   // Handle foreground message
//   const onMessageListener = messaging().onMessage(async remoteMessage => {
//     console.log('Foreground Message:', remoteMessage);
//     await displayNotification(remoteMessage);
//   });

//   // When app is opened from background
//   const onNotificationOpenedApp = messaging().onNotificationOpenedApp(
//     remoteMessage => {
//       if (remoteMessage) {
//         console.log('Opened from background:', remoteMessage.notification);
//         Alert.alert(
//           'Opened from background!',
//           remoteMessage.notification?.title ?? '',
//         );
//       }
//     },
//   );

//   // When app is opened from quit state
//   const getInitialNotification = async () => {
//     const remoteMessage = await messaging().getInitialNotification();
//     if (remoteMessage) {
//       console.log('Opened from quit state:', remoteMessage.notification);
//       Alert.alert(
//         'Opened from quit state!',
//         remoteMessage.notification?.title ?? '',
//       );
//     }
//   };

//   // Display local notification
//   const displayNotification = async (remoteMessage: any) => {
//     await notifee.requestPermission();

//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });

//     await notifee.displayNotification({
//       title: remoteMessage.notification?.title,
//       body: remoteMessage.notification?.body,
//       android: {
//         channelId: 'default',
//         pressAction: {
//           id: 'default',
//         },
//       },
//     });
//   };

//   requestUserPermission();
//   getFcmToken();
//   getInitialNotification();

//   return () => {
//     onMessageListener(); // Unsubscribe
//     onNotificationOpenedApp(); // Unsubscribe
//   };
// };
