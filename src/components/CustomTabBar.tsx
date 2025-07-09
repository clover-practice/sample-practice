// components/CustomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTabBarVisibility } from './TabBarVisibilityContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
 


const ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Category: { active: 'grid', inactive: 'grid-outline' },
  Messages: { active: 'chatbubble', inactive: 'chatbubble-outline' },
  Moments: { active: 'camera', inactive: 'camera-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
  Settings: { active: 'settings', inactive: 'settings-outline' },
};

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { translateY } = useTabBarVisibility();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.tabContainer, animatedStyle]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const iconName = isFocused
          ? ICONS[route.name]?.active
          : ICONS[route.name]?.inactive;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.tabButton}
          >
            {isFocused && <View style={styles.activeLine} />}
            <Ionicons
              name={iconName || 'ellipse'}
              size={24}
              color={isFocused ? '#2874F0' : '#888'}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff', 
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, 
    paddingBottom: Platform.OS === 'android' ? 0 : 8,
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 0, // 👈 iOS-only horizontal padding
    height: Platform.OS === 'android' ? 60 : 70,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  activeLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: Platform.OS === 'android' ? 2.5 : 2,
    backgroundColor: '#2874F0',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  tabLabelFocused: {
    color: '#2874F0',
    fontWeight: '600',
  },
});

export default CustomTabBar;
