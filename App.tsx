// App.tsx
import React, {useEffect} from 'react';

import AppNavigator from './src/Navigations/AppNavigator';
import {CartProvider} from './src/contexts/CartContext';
// import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    // <SafeAreaProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    // </SafeAreaProvider>
  );
};

export default App;
