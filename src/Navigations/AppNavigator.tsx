import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import ServiceMenuScreen from '../screens/ServiceMenuScreen';
import OtpScreen from '../screens/OtpScreen';
import StickyTabBarScreen from '../screens/StickyTabBarScreen';
import MapPicker from '../screens/GoogleMaps/MapPicker';
import MapAndListView from '../screens/MapAndListView';
import {StatusBar, Platform} from 'react-native';
import {TabBarVisibilityProvider} from '../components/TabBarVisibilityContext';
import {navigationRef} from '../utils/NavigationUtils';
import {ThemeProvider} from '../theme/ThemeContext';
import {NavigationContainer} from '@react-navigation/native';
import MyWalletScreen from '../screens/MyWalletScreen';
import MyBookAppoinment from '../screens/MyBookAppoinment';
import AppointmmentBooking from '../screens/AppointmmentBooking';
import CartScreen from '../screens/CartScreen';
import PermissionScreen from '../screens/PermissionScreen';
import LoginScreen from '../screens/LoginScreen';
import SalonDetailScreen from '../screens/SalonDetailScreen';
import RegistrationScreen from '../screens/RegistationScreen';
import PayPalCheckout from '../screens/PayPalCheckout';
import Payment from '../screens/Payment';
import navigationString from '../constants/navigationString';

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
          <Stack.Screen
            name={navigationString.ON_BORDING}
            component={OnboardingScreen}
          />
          <Stack.Screen name={navigationString.LOGIN} component={LoginScreen} />
          <Stack.Screen
            name={navigationString.MAIN_APP}
            component={BottomTabs}
          />
          <Stack.Screen
            name={navigationString.EDIT_PROFILE}
            component={EditProfileScreen}
          />
          <Stack.Screen
            name={navigationString.SERVICE_MENU}
            component={ServiceMenuScreen}
          />
          <Stack.Screen name={navigationString.OTP} component={OtpScreen} />
          <Stack.Screen
            name={navigationString.STICKY_TAB_BAR}
            component={StickyTabBarScreen}
          />
          <Stack.Screen
            name={navigationString.SELECT_ADDRESS}
            component={MapPicker}
          />
          <Stack.Screen
            name={navigationString.PERMISSION}
            component={PermissionScreen}
          />

          {/* <Stack.Screen name="MapAndListView" component={MapAndListView} /> */}
          <Stack.Screen
            name={navigationString.WALLET}
            component={MyWalletScreen}
          />
          <Stack.Screen
            name={navigationString.APPOINTMENT_BOOKING}
            component={AppointmmentBooking}
          />
          <Stack.Screen
            name={navigationString.BOOKED_APPOINTMENT}
            component={MyBookAppoinment}
          />
          <Stack.Screen
            name={navigationString.SALON_DETAILS}
            component={SalonDetailScreen}
          />
          <Stack.Screen
            name={navigationString.CUSTOMER_KYC}
            component={RegistrationScreen}
          />
          <Stack.Screen
            name={navigationString.PAY_PAL}
            component={PayPalCheckout}
          />
          <Stack.Screen name={navigationString.PAYMENT} component={Payment} />
        </Stack.Navigator>
      </TabBarVisibilityProvider>
    </NavigationContainer>
  </ThemeProvider>
);

export default AppNavigator;
