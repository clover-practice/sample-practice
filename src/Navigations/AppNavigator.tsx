import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import ServiceMenuScreen from '../screens/ServiceMenuScreen';
import OtpScreen from '../screens/OtpScreen';
import StickyTabBarScreen from '../screens/StickyTabBarScreen';
import MapPicker from '../screens/GoogleMaps/MapPicker';
import MapAndListView from '../screens/MapAndListView';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar, Platform} from 'react-native';
import {TabBarVisibilityProvider} from '../components/TabBarVisibilityContext';
import {navigationRef} from '../utils/NavigationUtils';
import {ThemeProvider} from '../theme/ThemeContext';
import MyWalletScreen from '../screens/MyWalletScreen';
import MyBookAppoinment from '../screens/MyBookAppoinment';
import AppointmmentBooking from '../screens/AppointmmentBooking';
import CartScreen from '../screens/CartScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <ThemeProvider>
    <NavigationContainer ref={navigationRef}>
      <TabBarVisibilityProvider>
        <StatusBar
          translucent={Platform.OS === 'android' ? false : true}
          backgroundColor="#ffffff"
          barStyle="dark-content"
        />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={BottomTabs} />
          <Stack.Screen
            name="EditProfileScreen"
            component={EditProfileScreen}
          />
          <Stack.Screen
            name="ServiceMenuScreen"
            component={ServiceMenuScreen}
          />
          <Stack.Screen name="OtpScreen" component={OtpScreen} />
          <Stack.Screen
            name="StickyTabBarScreen"
            component={StickyTabBarScreen}
          />
          <Stack.Screen name="MapPicker" component={MapPicker} />
          <Stack.Screen name="MapAndListView" component={MapAndListView} />
          <Stack.Screen name="MyWalletScreen" component={MyWalletScreen} />
          <Stack.Screen
            name="AppointmmentBooking"
            component={AppointmmentBooking}
          />
          <Stack.Screen name="MyBookAppoinment" component={MyBookAppoinment} />
        </Stack.Navigator>
      </TabBarVisibilityProvider>
    </NavigationContainer>
  </ThemeProvider>
);

export default AppNavigator;
