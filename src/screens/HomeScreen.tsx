import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import TopSearchBar from '../components/HomeHeaderComponent';
import BreakerText from '../components/BreakerText';
import CustomCarousel from '../components/CustomCarousel';
import {getAddressFromLocation} from '@logisticinfotech/react-native-geocoding-reversegeocoding';
import {navigate} from '../utils/NavigationUtils';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {useTabBarVisibility} from '../components/TabBarVisibilityContext';
import Constants from '../constants/Constants';

// --- NEW IMPORTS FOR NAVIGATION PARAMS ---
import {useRoute, RouteProp} from '@react-navigation/native';
import MapAndListView from './MapAndListView';

// --- IMPORTANT: Define RootStackParamList (must match MapPicker.tsx and AppNavigator.tsx) ---
type RootStackParamList = {
  HomeScreen: {selectedAddress?: string} | undefined; // HomeScreen can now receive selectedAddress
  MapPicker: undefined;
  Login: undefined;
  Onboarding: undefined; // Keep Onboarding if it's part of your stack
  ServiceMenuScreen: undefined; // Assuming this is another screen in your stack
  // ... add any other screens that are part of your main navigation stack
};

// Define types for HomeScreen's route prop
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

import {getValue} from '../utils/keychainStorage';
import responsive from '../utils/responsive';

const HomeScreen = () => {
  const [currentCity, setCurrentCity] = useState('Fetching...');
  const name = 'R'; // Assuming 'R' is a placeholder for a user's name
  const firstChar = name.charAt(0).toUpperCase();

  // --- NEW: Get the route object to access parameters ---
  const route = useRoute<HomeScreenRouteProp>();

  const hasLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
  };

  const requestAndFetchAddress = async () => {
    try {
      // Handle permissions
      if (Platform.OS === 'android') {
        const granted = await hasLocationPermission();
        if (!granted) {
          console.warn('Permission not granted!');
          setCurrentCity('Permission Denied');
          return;
        }
      } else if (Platform.OS === 'ios') {
        const authStatus = await Geolocation.requestAuthorization('whenInUse');
        if (authStatus !== 'granted') {
          setCurrentCity('Permission Denied');
          return;
        }
      }

      // Define type for geocoding response
      type GeocodeResult = {
        city?: string;
        locality?: string;
        subAdminArea?: string;
        adminArea?: string;
        [key: string]: any; // catch-all for other fields
      };

      type GeocodeResponse = {
        result?: GeocodeResult;
      };

      // Get current position
      Geolocation.getCurrentPosition(
        async ({coords: {latitude, longitude}}) => {
          try {
            const response = await getAddressFromLocation(latitude, longitude);
            const typedResponse = response as GeocodeResponse;

            const result = typedResponse?.result;

            const city =
              result?.city ||
              result?.locality ||
              result?.subAdminArea ||
              result?.adminArea ||
              'Unknown City';

            setCurrentCity(city);
          } catch (e) {
            console.warn('Geocoding error:', e);
            setCurrentCity('Address Unavailable');
          }
        },
        error => {
          console.warn('Location error:', error);
          setCurrentCity('Location Error');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (err) {
      console.warn('Permission error:', err);
      setCurrentCity('Error Occurred');
    }
  };

  // --- Original useEffect for fetching current address on mount ---
  useEffect(() => {
    requestAndFetchAddress();
  }, []);

  // --- NEW useEffect to listen for selectedAddress from MapPicker ---
  useEffect(() => {
    // Check if selectedAddress parameter exists and is different from currentCity
    if (
      route.params?.selectedAddress &&
      route.params.selectedAddress !== currentCity
    ) {
      setCurrentCity(route.params.selectedAddress);
      // Optional: If you want to clear the param after using it (so it doesn't persist
      // if you navigate away and come back without re-selecting), you can do this:
      // navigation.setParams({ selectedAddress: undefined });
      // Note: For setParams, you'd need to import 'useNavigation' and get the navigation object.
    }
  }, [route.params?.selectedAddress]); // Re-run this effect when selectedAddress param changes

  const tabBarHeight = useBottomTabBarHeight();
  const {translateY} = useTabBarVisibility();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - scrollY.value;

      if (diff > 10) {
        translateY.value = withTiming(tabBarHeight, {duration: 200});
      } else if (diff < -10) {
        translateY.value = withTiming(0, {duration: 200});
      }

      scrollY.value = currentY;
    },
  });

  const [userName, setUserName] = useState('');
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userName = await getValue(Constants.USER_NAME);
    console.log('GET USER NAME :- ', userName);
    //  const name = "R";
    setUserName(userName.charAt(0).toUpperCase());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <TopSearchBar
          city={currentCity} // This will now reflect the selected address
          offerLabel="50% Offer"
          userInitial={userName}
          onPressAvatar={() => navigate('ServiceMenuScreen')}
          onPressLocation={() => navigate('MapPicker')} // This navigates to MapPicker
        />

        <CustomCarousel
          data={[
            {
              id: 1,
              titleMessage: 'A new way to be fresh this summer!',
              uri: require('../assets/images/banner.png'),
            },
            {
              id: 2,
              titleMessage: 'A new way to be fresh this summer!',
              uri: require('../assets/images/banner.png'),
            },
            {
              id: 3,
              titleMessage: 'A new way to be fresh this summer!',
              uri: require('../assets/images/banner.png'),
            },
          ]}
        />

        <BreakerText text="SALON BY PRODUCTS" />
        <BreakerText text="SALON NEAR BY YOU" />
        <MapAndListView />

        <BreakerText text="SALON BY PRODUCTS" />

        {/* Spacer to avoid bottom content hiding under tab bar */}
        <View style={{height: tabBarHeight + 20}} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: responsive.padding(16),
    paddingBottom: responsive.padding(30),
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
});

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//     marginTop: 50,
//     marginBottom: 20,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//   },
// });
