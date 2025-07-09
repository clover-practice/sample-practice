import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import BottomTabs from './BottomTabs';
import EditProfileScreen from '../screens/EditProfileScreen';
import ServiceMenuScreen from '../screens/ServiceMenuScreen';
import OtpScreen from '../screens/OtpScreen';
const Stack = createNativeStackNavigator();
 

const AppNavigator = () => (
   <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={BottomTabs} />
          <Stack.Screen name='EditProfileScreen' component={EditProfileScreen}/>
          <Stack.Screen name='ServiceMenuScreen' component={ServiceMenuScreen}/>
          <Stack.Screen name='OtpScreen' component={OtpScreen}/>
          
        </Stack.Navigator>
);

export default AppNavigator;
