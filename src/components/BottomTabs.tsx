// BottomTabs.tsx
import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const HomeScreen = () => (
  <View style={styles.screen}>
    <Text>Home</Text>
  </View>
);
const ContactScreen = () => (
  <View style={styles.screen}>
    <Text>Contact</Text>
  </View>
);
const NotificationScreen = () => (
  <View style={styles.screen}>
    <Text>Notifications</Text>
  </View>
);
const SettingsScreen = () => (
  <View style={styles.screen}>
    <Text>Settings</Text>
  </View>
);

const CustomTabBarButton = ({children, onPress}: any) => (
  <TouchableOpacity
    style={styles.centerButtonContainer}
    onPress={onPress}
    activeOpacity={0.9}>
    <View style={styles.centerButton}>{children}</View>
  </TouchableOpacity>
);

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons name="home" size={22} color={focused ? '#000' : '#999'} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="users"
              size={22}
              color={focused ? '#000' : '#999'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Ionicons name="maximize" size={22} color="#fff" />,
          tabBarButton: props => (
            <CustomTabBarButton {...props}>
              <Ionicons name="maximize" size={24} color="#fff" />
            </CustomTabBarButton>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons name="bell" size={22} color={focused ? '#000' : '#999'} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="settings"
              size={22}
              color={focused ? '#000' : '#999'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 4},
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  centerButtonContainer: {
    top: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
