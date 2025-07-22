// App.tsx
import React, {useEffect} from 'react';

import AppNavigator from './src/Navigations/AppNavigator';
import {CartProvider} from './src/contexts/CartContext';
const App = () => {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
};

export default App;
