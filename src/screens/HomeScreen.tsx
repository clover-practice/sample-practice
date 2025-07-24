import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import TopSearchBar from '../components/HomeHeaderComponent';
import BreakerText from '../components/BreakerText';
import CustomCarousel from '../components/CustomCarousel';
import { getAddressFromLocation } from '@logisticinfotech/react-native-geocoding-reversegeocoding';
import { navigate } from '../utils/NavigationUtils';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import { useTabBarVisibility } from '../components/TabBarVisibilityContext';
import Constants from '../constants/Constants';

// NEW IMPORTS FOR NAVIGATION PARAMS
import { useRoute, RouteProp } from '@react-navigation/native';
import MapAndListView from './MapAndListView';

// IMPORTANT: Define RootStackParamList (must match MapPicker.tsx and AppNavigator.tsx)
/**
 * @type {RootStackParamList}
 * @description Defines the type mapping for navigation routes and their parameters within the application's root stack.
 * Ensures type safety for navigation operations.
 */
type RootStackParamList = {
  HomeScreen: { selectedAddress?: string; selectedCoords?: { latitude: number; longitude: number } } | undefined;
  MapPicker: undefined;
  Login: undefined;
  Onboarding: undefined;
  ServiceMenuScreen: undefined;
  // ... add any other screens that are part of your main navigation stack
};

/**
 * @type {HomeScreenRouteProp}
 * @description Type definition for the route prop specific to the HomeScreen,
 * allowing access to parameters passed to this screen.
 */
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

// Assuming these are in utils/keychainStorage.ts based on your context
import { getLocation, getValue, setValue, storeLocation } from '../utils/keychainStorage';


const HomeScreen = () => {

  const [currentCity, setCurrentCity] = useState('Fetching...');
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const route = useRoute<HomeScreenRouteProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const { translateY } = useTabBarVisibility();
  const scrollY = useSharedValue(0);
  const hasLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to find nearby services.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      // For iOS, requestAuthorization handles permission prompt and status
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
  };


  const requestAndFetchAddress = async (): Promise<void> => {
    setLocationLoading(true); // Start loading
    setLocationError(null); // Clear any previous errors
    setCurrentCity('Fetching...');
    try {
      const permissionGranted = await hasLocationPermission();
      if (!permissionGranted) {
        console.warn('Permission not granted!');
        setLocationError('Location permission denied. Please enable location services in your device settings.');
        setLocationLoading(false);
        return;
      }

      type GeocodeResult = {
        city?: string; locality?: string; subAdminArea?: string; adminArea?: string;[key: string]: any;
      };

      type GeocodeResponse = {
        result?: GeocodeResult;
      };

      Geolocation.getCurrentPosition(
        async (position) => { // Use position directly to get coords
          const { latitude, longitude } = position.coords; // Extract coords

          // Set coordinates in local state
          setUserCoordinates({ latitude, longitude });

          try {
            const response = await getAddressFromLocation(latitude, longitude);
            const typedResponse = response as GeocodeResponse;
            const result = typedResponse?.result;
            // Prioritize different address components to find the most specific city/area name
            const city =
              result?.city ||
              result?.locality ||
              result?.subAdminArea ||
              result?.adminArea ||
              'Unknown City';

            setCurrentCity(city);
            // Store latitude, longitude, and address in keychain for persistence
            await storeLocation(latitude, longitude, city);
            setLocationLoading(false); // End loading
          } catch (e) {
            console.warn('Geocoding error:', e);
            setCurrentCity('Address Unavailable');
            setLocationError('Could not get address for your location.');
            setLocationLoading(false);
          }
        },
        error => {
          console.warn('Location error:', error);
          setCurrentCity('Location Error');
          setLocationError(`Failed to get location: ${error.message}`);
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (err) {
      console.warn('Permission error:', err);
      setCurrentCity('Error Occurred');
      setLocationError('Error requesting location permission.');
      setLocationLoading(false);
    }
  };

  const getUserData = async (): Promise<void> => {
    const currentAdd = await getValue(Constants.CITY_ADDRESS);
    setCurrentCity(currentAdd);
    const name = await getValue(Constants.USER_NAME);
    console.log("GET USER NAME :- ", name);
    if (name) {
      setUserName(name.charAt(0).toUpperCase());
    } else {
      setUserName('U'); // Default if no username
    }
  };

  /**
   * @constant {Animated.AnimatedScrollHandler} scrollHandler
   * @description An animated scroll handler that updates the `translateY` shared value
   * to hide/show the bottom tab bar based on scroll direction.
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - scrollY.value;

      // Hide tab bar if scrolling down significantly
      if (diff > 10) {
        translateY.value = withTiming(tabBarHeight, { duration: 200 });
      }
      // Show tab bar if scrolling up significantly
      else if (diff < -10) {
        translateY.value = withTiming(0, { duration: 200 });
      }

      scrollY.value = currentY; // Update scrollY for next comparison
    },
  });

  // =====================================
  // EFFECTS
  // =====================================

  /**
   * @effect
   * @description This effect runs once on component mount.
   * It attempts to load location data from Keychain. If successful, it updates
   * `currentCity` and `userCoordinates`. If no stored location, it requests
   * live GPS location and address. It also fetches user data.
   */
  useEffect(() => {
    (async () => {
      setLocationLoading(true); // Start loading for initial fetch
      setLocationError(null); // Clear errors

      const loc = await getLocation();

      // Check if all necessary location data is present in Keychain
      if (loc?.address && loc?.latitude && loc?.longitude) {
        setCurrentCity(loc.address);
        setUserCoordinates({ latitude: loc.latitude, longitude: loc.longitude }); // Set coordinates from keychain
        console.log('🏠 Loaded from Keychain:', loc);
        setLocationLoading(false); // End loading
      } else {
        requestAndFetchAddress(); // Fallback to live GPS if not in keychain or incomplete
      }
    })();
    getUserData(); // Fetch user data on initial mount
  }, []); // Empty dependency array means this runs only once on mount

  /**
   * @effect
   * @description This effect listens for updates to `selectedAddress` and `selectedCoords`
   * from the `route.params`, typically when returning from the `MapPicker` screen.
   * It updates the `currentCity` and `userCoordinates` states and stores the new location in Keychain.
   */
  useEffect(() => {
    // Check if both selectedAddress AND selectedCoords parameters exist
    if (route.params?.selectedAddress && route.params?.selectedCoords) {
      const { selectedAddress, selectedCoords } = route.params;

      // Only update if the new selection is genuinely different to avoid unnecessary state updates
      if (selectedAddress !== currentCity ||
        selectedCoords.latitude !== userCoordinates?.latitude ||
        selectedCoords.longitude !== userCoordinates?.longitude) {

        setCurrentCity(selectedAddress);
        setUserCoordinates(selectedCoords); // Update coordinates state from MapPicker

        // Store the new selected location (address and coordinates) in keychain
        storeLocation(selectedCoords.latitude, selectedCoords.longitude, selectedAddress);

        console.log('📍 Updated from MapPicker:', selectedAddress, selectedCoords);
        // Optional: If you want to clear the param after using it to prevent re-triggering
        // on subsequent focus, you'd typically do:
        // import { useNavigation } from '@react-navigation/native';
        // const navigation = useNavigation();
        // navigation.setParams({ selectedAddress: undefined, selectedCoords: undefined });
      }
    }
  }, [route.params?.selectedAddress, route.params?.selectedCoords, currentCity, userCoordinates]); // Dependencies: changes in route params or local state

  // =====================================
  // CONDITIONAL RENDERING / LOADING/ERROR STATES
  // =====================================

  /**
   * @renderCondition
   * @description Displays a full-screen loading indicator when the initial location data is being fetched.
   */
  if (locationLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </SafeAreaView>
    );
  }

  /**
   * @renderCondition
   * @description Displays a full-screen error message and a retry button
   * if location fetching failed and no valid coordinates are available to display services.
   */
  if (locationError && !userCoordinates) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {locationError}</Text>
        <TouchableOpacity onPress={requestAndFetchAddress} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry Location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // =====================================
  // MAIN COMPONENT RENDER
  // =====================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16} // Standard for smooth scroll events
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <TopSearchBar
          city={currentCity} // This will now reflect the dynamically updated city/address
          offerLabel="50% Offer"
          userInitial={userName}
          onPressAvatar={() => navigate('EditProfileScreen')}
          onPressLocation={() => navigate('MapPicker')} // Navigates to MapPicker
        />

        <CustomCarousel
          data={[
            { id: 1, titleMessage: 'A new way to be fresh this summer!', uri: require('../assets/images/banner.png'), },
            { id: 2, titleMessage: 'A new way to be fresh this summer!', uri: require('../assets/images/banner.png'), },
            { id: 3, titleMessage: 'A new way to be fresh this summer!', uri: require('../assets/images/banner.png'), },
          ]}
        />

        <BreakerText text="SALON NEAR BY YOU" />

        {userCoordinates ? (
          <MapAndListView
            latitude={userCoordinates.latitude}
            longitude={userCoordinates.longitude}
          />
        ) : (
          // Fallback message if no location is available for MapAndListView
          <View style={styles.mapListMessageContainer}>
            <Text style={styles.infoText}>No location available to display nearby salons.</Text>
            {locationError && <Text style={styles.infoTextSub}>{locationError}</Text>}
            {/* Show retry button only if there's an error and no coordinates */}
            {!locationError && !locationLoading && (
              <TouchableOpacity onPress={requestAndFetchAddress} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Try Getting My Location</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <BreakerText text="SALON BY PRODUCTS" />
        {/* <PlaceDetailsScreen/> */}

        {/* Spacer view to ensure content at the bottom isn't hidden by the tab bar */}
        <View style={{ height: tabBarHeight + 20 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

// =====================================
// STYLES
// =====================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 50 : 0, // Adjust as needed for Android status bar
    paddingBottom: 20, // Provides space at the bottom of the safe area for content
  },
  scrollContent: {
    backgroundColor: '#fff',
    paddingBottom: 20, // Ensure content isn't cut off by tab bar
  },
  centeredContainer: { // For full-screen loading/error
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20, // Add some padding
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mapListLoadingContainer: { // For loading within the MapAndListView section (currently unused, but good to have)
    minHeight: 150, // Give it some height for visibility
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  mapListErrorContainer: { // For error within the MapAndListView section (currently unused, but good to have)
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffe6e6', // Light red background
    marginHorizontal: 5,
    borderRadius: 8,
  },
  mapListMessageContainer: { // For general info messages within the MapAndListView section
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  infoTextSub: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
    marginHorizontal: 10,
  },
}); 
