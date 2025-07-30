import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useTabBarVisibility} from './TabBarVisibilityContext';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ICONS: Record<string, {active: string; inactive: string}> = {
  Home: {active: 'home', inactive: 'home-outline'},
  Category: {active: 'grid', inactive: 'grid-outline'},
  Messages: {active: 'chatbubble', inactive: 'chatbubble-outline'},
  Moments: {active: 'camera', inactive: 'camera-outline'},
  Profile: {active: 'person', inactive: 'person-outline'},
  Settings: {active: 'settings', inactive: 'settings-outline'},
};

const BASE_HEIGHT = 60; // base height for Android
const IOS_HEIGHT = 70; // base height for iOS

const CustomTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
  const {translateY} = useTabBarVisibility();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const tabBarHeight =
    (Platform.OS === 'ios' ? IOS_HEIGHT : BASE_HEIGHT) + insets.bottom;

  return (
    <Animated.View
      style={[
        styles.tabContainer,
        animatedStyle,
        {
          paddingBottom: insets.bottom,
          height: tabBarHeight,
        },
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
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
            style={styles.tabButton}>
            {isFocused && <View style={styles.activeLine} />}
            <Ionicons
              name={iconName || 'ellipse'}
              size={24}
              color={isFocused ? '#2874F0' : '#888'}
            />

            {/* <View style={styles.iconWrapper}>
              <Ionicons
                name={iconName || 'ellipse'}
                size={24}
                color={isFocused ? '#2874F0' : '#888'}
              />
            </View> */}

            <Text
              style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
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
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 10,
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
    height: Platform.OS === 'android' ? 1.5 : 1.5,
    backgroundColor: '#2874F0',
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
