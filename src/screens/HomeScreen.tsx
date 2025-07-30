import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import TopSearchBar from '../components/HomeHeaderComponent';
import BreakerText from '../components/BreakerText';
import CustomCarousel from '../components/CustomCarousel';
import {getAddressFromLocation} from '@logisticinfotech/react-native-geocoding-reversegeocoding';
import {navigate} from '../utils/NavigationUtils';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import Animated from 'react-native-reanimated';
import {useTabBarVisibility} from '../components/TabBarVisibilityContext';
import {useRoute, RouteProp} from '@react-navigation/native';
import MapAndListView from './MapAndListView';
import {getLocation, getValue, storeLocation} from '../utils/keychainStorage';
import {useHideTabBarOnScroll} from '../components/useHideTabBarOnScroll';
import Constants from '../constants/Constants';
import {SafeAreaView} from 'react-native-safe-area-context';

// Type Definitions
type RootStackParamList = {
  HomeScreen:
    | {
        selectedAddress?: string;
        selectedCoords?: {latitude: number; longitude: number};
      }
    | undefined;
};

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
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
    } else {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
  };

  const requestAndFetchAddress = async () => {
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
            const response = await getAddressFromLocation(latitude, longitude);
            const result = (response as any)?.result;
            const city =
              result?.city ||
              result?.locality ||
              result?.subAdminArea ||
              result?.adminArea ||
              'Unknown City';

            setCurrentCity(city);
            await storeLocation(latitude, longitude, city);
          } catch (e) {
            setCurrentCity('Address Unavailable');
            setLocationError('Could not get address.');
          } finally {
            setLocationLoading(false);
          }
        },
        error => {
          setCurrentCity('Location Error');
          setLocationError(error.message);
          setLocationLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (err) {
      setLocationError('Error requesting location permission.');
      setLocationLoading(false);
    }
  };

  const getUserData = async () => {
    const currentAdd = await getValue(Constants.CITY_ADDRESS);
    setCurrentCity(currentAdd);
    const name = await getValue(Constants.USER_NAME);
    setUserName(name ? name.charAt(0).toUpperCase() : 'U');
  };

  useEffect(() => {
    (async () => {
      const loc = await getLocation();
      if (loc?.address && loc?.latitude && loc?.longitude) {
        setCurrentCity(loc.address);
        setUserCoordinates({latitude: loc.latitude, longitude: loc.longitude});
        setLocationLoading(false);
      } else {
        requestAndFetchAddress();
      }
    })();
    getUserData();
  }, []);

  useEffect(() => {
    if (route.params?.selectedAddress && route.params?.selectedCoords) {
      const {selectedAddress, selectedCoords} = route.params;
      setCurrentCity(selectedAddress);
      setUserCoordinates(selectedCoords);
      storeLocation(
        selectedCoords.latitude,
        selectedCoords.longitude,
        selectedAddress,
      );
    }
  }, [route.params]);

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
