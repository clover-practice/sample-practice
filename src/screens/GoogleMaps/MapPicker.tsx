import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Text,
  Dimensions,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  ListRenderItem,
  ScrollView, // Import ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import debounce from 'lodash.debounce';
import CustomHeader from '../../components/CustomHeader';
import { goBack } from '../../utils/NavigationUtils';

// Define interfaces for better type safety
interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface GoMapsPrediction {
  description: string;
  place_id: string;
  // Add other properties if gomaps.pro autocomplete returns more
}

interface GoMapsGeocodeResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  // ... other geocode properties
}

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Replace with your actual gomaps.pro API key
const GOMAPS_API_KEY = 'AlzaSyHbXxV_iKjbmuS9F2kTeHuMdpp6j0UGYOe'; // Assuming this is a placeholder and you have your actual key.

const MapPicker: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [predictions, setPredictions] = useState<GoMapsPrediction[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const [displaySearchResults, setDisplaySearchResults] = useState<boolean>(false); // New state to control search results display

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async (): Promise<void> => {
    try {
      if (Platform.OS === 'ios') {
        const status = await Geolocation.requestAuthorization('whenInUse');
        if (status === 'granted') {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
          setLoading(false);
        }
      } else if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show it on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
          setLoading(false);
        }
      }
    } catch (err: any) {
      console.warn(err);
      setLoading(false);
    }
  };

  const getCurrentLocation = (): void => {
    setLoading(true); // Set loading to true when trying to get current location
    Geolocation.getCurrentPosition(
      (position) => {
        const region: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setCurrentLocation(region);
        setSelectedPlace(region); // Also set as selected place
        setSearchText('Your Current Location'); // Update search text
        setLoading(false);
        mapRef.current?.animateToRegion(region, 1000);
      },
      (error: any) => {
        console.log(error.code, error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchGoMapsPredictions = async (input: string): Promise<void> => {
    if (!input) {
      setPredictions([]);
      setDisplaySearchResults(false);
      return;
    }
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOMAPS_API_KEY}`
      );
      const data: { predictions?: GoMapsPrediction[] } = await response.json();
      if (data.predictions) {
        setPredictions(data.predictions);
        setDisplaySearchResults(true);
      } else {
        setPredictions([]);
        setDisplaySearchResults(false);
      }
    } catch (error: any) {
      console.error('Error fetching GoMaps predictions:', error);
      setPredictions([]);
      setDisplaySearchResults(false);
    }
  };

  const debouncedFetchPredictions = useCallback(
    debounce(fetchGoMapsPredictions, 500),
    []
  );

  const handleSearchTextChange = (text: string): void => {
    setSearchText(text);
    if (text.length > 2) { // Only fetch predictions if text is long enough
      debouncedFetchPredictions(text);
    } else {
      setPredictions([]);
      setDisplaySearchResults(false);
    }
  };

  const onPlaceSelect = async (prediction: GoMapsPrediction): Promise<void> => {
    setSearchText(prediction.description);
    setPredictions([]);
    setDisplaySearchResults(false);
    Keyboard.dismiss();

    try {
      // THIS IS A PLACEHOLDER. VERIFY GOMAPS.PRO'S ACTUAL GEOCODING/PLACE DETAILS API.
      const detailsResponse = await fetch(
        `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(prediction.description)}&key=${GOMAPS_API_KEY}`
      );
      const detailsData: { results?: GoMapsGeocodeResult[] } = await detailsResponse.json();

      if (detailsData.results && detailsData.results.length > 0) {
        const { lat, lng } = detailsData.results[0].geometry.location;
        const newRegion: Location = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setSelectedPlace(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } else {
        console.log('No geometry details found for selected place.');
      }
    } catch (error: any) {
      console.error('Error fetching place details from GoMaps:', error);
    }
  };

  const renderPredictionItem: ListRenderItem<GoMapsPrediction> = ({ item }) => (
    <TouchableOpacity
      style={styles.predictionItem}
      onPress={() => onPlaceSelect(item)}
    >
      <Text style={styles.predictionText}>{item.description}</Text>
    </TouchableOpacity>
  );

  // You can keep the loading indicator as is, or adjust based on your preference
  if (loading && !currentLocation) { // Only show full screen loading if no location is fetched yet
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Getting current location...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader showBack={true} title='Change Location' onBackPress={goBack} />
      <View style={styles.contentContainer}>
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a area,street name..."
            value={searchText}
            onChangeText={handleSearchTextChange}
            onFocus={() => {
                if (searchText.length > 2) setDisplaySearchResults(true);
            }}
            onBlur={() => setTimeout(() => setDisplaySearchResults(false), 200)} // Delay to allow touch on list item
          />

          <View style={styles.orSeparator}>
            <Text style={styles.orText}>Or</Text>
          </View>

          <TouchableOpacity style={styles.useCurrentLocationButton} onPress={getCurrentLocation}>
            <Text style={styles.useCurrentLocationButtonText}>Use My Current Location</Text>
          </TouchableOpacity>
        </View>

        {displaySearchResults && predictions.length > 0 && (
          <FlatList<GoMapsPrediction>
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={renderPredictionItem}
            style={styles.predictionListBelowSearch}
            keyboardShouldPersistTaps="handled"
          />
        )}

        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={currentLocation || { latitude: 20.5937, longitude: 78.9629, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }} // Default to India if no current location
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
        >
          {currentLocation && ( // Show marker for current location if available
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="You are here"
              description="Your current location"
            />
          )}
          {selectedPlace && ( // Show marker for selected search result
            <Marker
              coordinate={{
                latitude: selectedPlace.latitude,
                longitude: selectedPlace.longitude,
              }}
              title="Selected Location"
              description="Location from search"
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Adjust for Android status bar
  },
  contentContainer: {
    flex: 1,
    // No absolute positioning for search container here
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    // shadow properties can be added here if needed
  },
  searchInput: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  orSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  orText: {
    fontSize: 16,
    color: '#888',
  },
  useCurrentLocationButton: {
    backgroundColor: '#5CACEE', // A light blue color for the button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10, // Space below the button
  },
  useCurrentLocationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  predictionListBelowSearch: {
    maxHeight: Dimensions.get('window').height * 0.4, // Max height for the prediction list
    backgroundColor: 'white',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    // Add shadow if desired
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 15, // Align with search input
    marginBottom: 10,
  },
  predictionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10, // Space for a potential icon
  },
  map: {
    flex: 1, // Map will take remaining space
  },
});

export default MapPicker;