import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert, // Import Alert for user feedback
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import TopSearchBar from '../components/HomeHeaderComponent';
import BreakerText from '../components/BreakerText';
import CustomCarousel from '../components/CustomCarousel';
// Note: Keeping this import for existing usage, but MapPicker now uses GoMaps.
// Ensure consistency if you want to use the same geocoding logic everywhere.
import {getAddressFromLocation} from '@logisticinfotech/react-native-geocoding-reversegeocoding';
import {navigate} from '../utils/NavigationUtils';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import Animated from 'react-native-reanimated';
import {useTabBarVisibility} from '../components/TabBarVisibilityContext';
import {useRoute, RouteProp} from '@react-navigation/native';
import MapAndListView from './MapAndListView';
import {
  getLocation,
  getValue,
  storeLocation,
  setValue,
} from '../utils/keychainStorage'; // Added setValue
import {useHideTabBarOnScroll} from '../components/useHideTabBarOnScroll';
import Constants from '../constants/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar';

// Type Definitions
type RootStackParamList = {
  HomeScreen:
    | {
        selectedAddress?: string;
        selectedCoords?: {latitude: number; longitude: number};
      }
    | undefined;
};
const placeholderTextList = [
  'Search for salons near you',
  'Products...',
  'Look for trending styles',
  'Find deals around you',
];
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [currentCity, setCurrentCity] = useState('Fetching...');
  const [userCoordinates, setUserCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const route = useRoute<HomeScreenRouteProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const {translateY} = useTabBarVisibility();
  const scrollHandler = useHideTabBarOnScroll(translateY);

  const hasLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to show nearby salons.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
  };

  const requestAndFetchAddress = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    setCurrentCity('Fetching...');
    try {
      const permissionGranted = await hasLocationPermission();
      if (!permissionGranted) {
        setLocationError(
          'Location permission denied. Enable location services in settings.',
        );
        setLocationLoading(false);
        return;
      }

      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          setUserCoordinates({latitude, longitude});

          try {
            // Using the existing geocoding library for this fallback path
            const response = await getAddressFromLocation(latitude, longitude);
            const result = (response as any)?.result;
            // const city =
            //   result?.formattedAddress || // Prefer formattedAddress if available
            //   result?.city ||
            //   result?.locality ||
            //   result?.subAdminArea ||
            //   result?.adminArea ||
            //   'Unknown City';
            const city =
              result?.subLocality || ', ' || result?.locality || 'Unknown City';

            console.log('RESPONSE ', result);
            console.log('RESPONSE FROM CITY', city);

            setCurrentCity(city);
            // Store this address in keychain as well
            await storeLocation(latitude, longitude, city);
            await setValue(Constants.CITY_ADDRESS, city); // Update Constants.CITY_ADDRESS
          } catch (e) {
            setCurrentCity('Address Unavailable');
            setLocationError('Could not get address.');
            console.error('Error fetching address:', e);
          } finally {
            setLocationLoading(false);
          }
        },
        error => {
          setCurrentCity('Location Error');
          setLocationError(error.message);
          setLocationLoading(false);
          Alert.alert(
            'Location Error',
            `Failed to get current location: ${error.message}`,
          );
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (err) {
      setLocationError('Error requesting location permission.');
      setLocationLoading(false);
      console.error('Error in requestAndFetchAddress:', err);
    }
  }, []); // useCallback to memoize the function

  const getUserData = useCallback(async () => {
    const name = await getValue(Constants.USER_NAME);
    setUserName(name ? name.charAt(0).toUpperCase() : 'U');
  }, []);

  useEffect(() => {
    const initializeHomeScreen = async () => {
      setLocationLoading(true); // Start loading

      // 1. Prioritize navigation parameters from MapPicker
      if (route.params?.selectedAddress && route.params?.selectedCoords) {
        const {selectedAddress, selectedCoords} = route.params;
        setCurrentCity(selectedAddress);
        setUserCoordinates(selectedCoords);
        // Ensure this new address is also stored in keychain for persistence
        await storeLocation(
          selectedCoords.latitude,
          selectedCoords.longitude,
          selectedAddress,
        );
        await setValue(Constants.CITY_ADDRESS, selectedAddress); // Crucial: Update Constants.CITY_ADDRESS
        setLocationLoading(false);
        return; // Exit early as we have the location
      }

      // 2. Fallback: Try to get address from Constants.CITY_ADDRESS first
      const storedCityAddress = await getValue(Constants.CITY_ADDRESS);
      if (storedCityAddress) {
        setCurrentCity(storedCityAddress);
        // Attempt to get coordinates from getLocation() if only address is found in CITY_ADDRESS
        const storedLoc = await getLocation();
        if (storedLoc?.latitude && storedLoc?.longitude) {
          setUserCoordinates({
            latitude: storedLoc.latitude,
            longitude: storedLoc.longitude,
          });
        } else {
          // If CITY_ADDRESS exists but no coordinates, we might need to geocode it
          // For simplicity, we'll proceed to requestAndFetchAddress if coordinates are critical for MapAndListView
          // Or you could add a geocoding call here for storedCityAddress
        }
        setLocationLoading(false);
        await getUserData(); // Fetch user data after setting location
        return; // Exit early as we have the address
      }

      // 3. Fallback: Try to get location (address + coords) from getLocation()
      const storedLoc = await getLocation();
      if (storedLoc?.address && storedLoc?.latitude && storedLoc?.longitude) {
        setCurrentCity(storedLoc.address);
        setUserCoordinates({
          latitude: storedLoc.latitude,
          longitude: storedLoc.longitude,
        });
        // Ensure Constants.CITY_ADDRESS is also updated with this full address if it wasn't already
        await setValue(Constants.CITY_ADDRESS, storedLoc.address);
        setLocationLoading(false);
        await getUserData(); // Fetch user data after setting location
        return; // Exit early as we have the location
      }

      // 4. Last resort: Request current device location
      await requestAndFetchAddress(); // This also updates currentCity and keychain
      await getUserData(); // Fetch user data after location is potentially fetched
    };

    initializeHomeScreen();
  }, [route.params, requestAndFetchAddress, getUserData]); // Dependencies: re-run if route params change or memoized functions change

  if (locationLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </SafeAreaView>
    );
  }

  if (locationError && !userCoordinates) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {locationError}</Text>
        <TouchableOpacity
          onPress={requestAndFetchAddress}
          style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry Location</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <TopSearchBar
          city={currentCity}
          offerLabel="50% Offer"
          userInitial={userName}
          onPressAvatar={() => navigate('EditProfileScreen')}
          onPressLocation={() => navigate('MapPicker')}
        />

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholderList={placeholderTextList}
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

        <BreakerText text="SALON NEAR BY YOU" />

        {userCoordinates ? (
          <MapAndListView
            latitude={userCoordinates.latitude}
            longitude={userCoordinates.longitude}
          />
        ) : (
          <View style={styles.mapListMessageContainer}>
            <Text style={styles.infoText}>No location available.</Text>
            {locationError && (
              <Text style={styles.infoTextSub}>{locationError}</Text>
            )}
          </View>
        )}

        <BreakerText text="SALON BY PRODUCTS" />

        <View style={{height: tabBarHeight + 20}} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  centeredContainer: {
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
    marginHorizontal: 20,
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
  mapListMessageContainer: {
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
