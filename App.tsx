// App.tsx 
import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './src/Navigations/AppNavigator';
import { TabBarVisibilityProvider } from './src/components/TabBarVisibilityContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import { navigationRef } from './src/utils/NavigationUtils';

  const   App=()=> {
  useEffect(() => {
    // Configure status bar when app mounts
    StatusBar.setBarStyle('dark-content'); // Light icons: 'light-content'
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('#ffffff'); // Status bar background for Android
      StatusBar.setTranslucent(false);        // Disable translucency to avoid overlay
    }
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <TabBarVisibilityProvider>
          <StatusBar
            translucent={Platform.OS === 'android' ? false : true}
            backgroundColor="#ffffff"
            barStyle="dark-content"
          />
          <AppNavigator />
        </TabBarVisibilityProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}


export default App;
