// App.tsx
import React, {useEffect} from 'react';
import {View, Text, Alert, PermissionsAndroid, Platform} from 'react-native';

import AppNavigator from './src/Navigations/AppNavigator';
import {CartProvider} from './src/contexts/CartContext';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
import {setupPushNotifications} from './src/utils/notificationService';

const App = () => {
  useEffect(() => {
    // requestUserPermission();
    setupPushNotifications();
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
