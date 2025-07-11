// navigation/BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import CustomTabBar from '../components/CustomTabBar';
import MessageScreen from '../screens/MessageScreen';
import MomentScreen from '../screens/MomentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Optional: hide headers
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Messages" component={MessageScreen} />
      <Tab.Screen name="Moments" component={MomentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} /> 
           
    </Tab.Navigator>
  );
};

export default BottomTabs;
