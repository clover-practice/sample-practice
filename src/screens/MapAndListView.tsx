import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  Modal,
  Pressable,
  FlatList, // FlatList imported
} from 'react-native';
import { getDistance } from 'geolib';
import * as Keychain from 'react-native-keychain'; // Import the keychain library

// Local Imports
import Strings from '../constants/Constants'; // Make sure this path is correct

// Interface for a single review from Google Places Details API
interface ApiReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number; // Rating is always present for Google reviews
  relative_time_description: string;
  text: string;
  time: number; // Unix timestamp
}

// Updated PlaceItem interface to include optional reviews fetched from details API
interface PlaceItem {
  id: string;
  title: string;
  description: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  rating: number | null; // Overall place rating from Nearby Search
  isOpen: boolean | null;
  iconUrl: string | null;
  distanceKm: string; // NEW: distance as string (e.g. "2.3")
}

// Interface for the detailed place information (including reviews)
// This will hold the 'result' structure from the Places Details API
interface DetailedPlaceItem extends PlaceItem {
  reviews?: ApiReview[]; // Optional reviews array
  formatted_phone_number?: string;
  website?: string;
  url?: string; // Google Maps URL
  // You might want to add other fields from PlaceResult if you plan to display them later
  // E.g., current_opening_hours?: OpeningHours; photos?: Photo[];
}

interface MapAndListViewProps {
  latitude: number | null;
  longitude: number | null;
  disableScroll?: boolean;
}

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height / 5;
const CARD_WIDTH = width - 10;
const NEARBY_SEARCH_RADIUS = '5000'; // 5 KM radius

const MapAndListView: React.FC<MapAndListViewProps> = ({
  latitude,
  longitude,
  disableScroll = false,
}) => {
  const [locations, setLocations] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Renamed from 'currentLocation' to 'deviceLocation' for clarity:
  // this represents the user's actual device location from props.
  const [deviceLocation, setDeviceLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // New state for the location specifically retrieved from the keychain.
  const [keychainStartLocation, setKeychainStartLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // New state for the review modal
  const [showReviewsModal, setShowReviewsModal] = useState<boolean>(false);
  // selectedPlaceDetails will now hold the full details including reviews
  const [selectedPlaceDetails, setSelectedPlaceDetails] = useState<DetailedPlaceItem | null>(null);
  const [fetchingReviews, setFetchingReviews] = useState<boolean>(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Function to read location from keychain
  // This function is memoized with useCallback as it doesn't depend on component state directly
  const readLocationFromKeychain = useCallback(async (alias: string = 'startLocation') => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.username === alias) {
        const location = JSON.parse(credentials.password);
        console.log('Location read from keychain successfully:', location);
        setKeychainStartLocation(location); // Update state with the keychain location
        return location;
      } else {
        console.log('No location found in keychain for alias:', alias);
        setKeychainStartLocation(null); // Ensure state is null if not found
        return null;
      }
    } catch (err) {
      console.warn('Could not read location from keychain:', err);
      setKeychainStartLocation(null); // Ensure state is null on error
      return null;
    }
  }, []); // Empty dependency array means this function is created once

  // Effect to load location from keychain when the component mounts
  useEffect(() => {
    readLocationFromKeychain();
  }, [readLocationFromKeychain]); // Depend on readLocationFromKeychain to ensure it's up-to-date

  const fetchPlaces = useCallback(
    async (loc: { latitude: number; longitude: number }) => {
      setLoading(true);
      setError(null);
      setLocations([]); // Clear previous locations

      try {
        const params = new URLSearchParams({
          location: `${loc.latitude},${loc.longitude}`,
          radius: NEARBY_SEARCH_RADIUS,
          name: Strings.NAME_PLACE,
          key: Strings.GOMAPS_API_KEY,
        });
        const url = `${Strings.NEARBY_PLACES_API_URL}?${params}`;
        console.log('Fetching Nearby Places API:', url);

        const res = await fetch(url);
        const data = await res.json();

        if (data.results) {
          const mapped: PlaceItem[] = data.results.map((place: any) => {
            const coord = place.geometry.location;
            const distMeters = getDistance(
              { latitude: loc.latitude, longitude: loc.longitude },
              { latitude: coord.lat, longitude: coord.lng }
            );
            const distanceKm = (distMeters / 1000).toFixed(1);

            return {
              id: place.place_id || `${coord.lat}-${coord.lng}`, // Use place_id as stable ID
              title: place.name,
              description: place.types?.map((t: string) => t.replace(/_/g, ' ')).join(', ') || 'Unknown',
              address: place.vicinity || 'No address',
              coordinate: { latitude: coord.lat, longitude: coord.lng },
              rating: place.rating ?? null,
              isOpen: place.opening_hours?.open_now ?? null,
              iconUrl: place.icon || null,
              distanceKm,
            };
          });

          // Sort locations by distanceKm (near to far)
          const sortedLocations = [...mapped].sort((a, b) => {
            // Convert string distance to number for accurate comparison
            const distA = parseFloat(a.distanceKm);
            const distB = parseFloat(b.distanceKm);
            return distA - distB;
          });

          setLocations(sortedLocations); // Set the sorted locations
        } else if (data.status === 'ZERO_RESULTS') {
          setError(`No “${Strings.NAME_PLACE}” found nearby.`);
          setLocations([]);
        } else {
          setError(`Places API error: ${data.status || 'Unknown status'}`);
          setLocations([]);
        }
      } catch (e: any) {
        console.error('Fetch error', e);
        setError(`Failed to load places: ${e.message || e}`);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setLocations]
  );

  const openGoogleMapsDirections = useCallback(
    async (destItem: PlaceItem) => {
      // Determine the starting point: prioritize keychain location, then device location
      const startLocation = keychainStartLocation || deviceLocation;

      if (!startLocation) {
        Alert.alert('Error', 'Cannot get directions as a starting location (from keychain or device) is not available.');
        return;
      }
      const src = startLocation; // Use the determined start location
      const dest = destItem.coordinate;

      const url = Platform.select({
        ios: `maps://?saddr=${src.latitude},${src.longitude}&daddr=${dest.latitude},${dest.longitude}&dirflg=d`,
        android: `geo:${src.latitude},${src.longitude}?q=${dest.latitude},${dest.longitude}(${encodeURIComponent(destItem.title)})&mode=d`,
      });

      if (!url) {
        Alert.alert('Error', 'Could not generate map URL for this platform.');
        return;
      }

      try {
        if (await Linking.canOpenURL(url)) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No map app available or could not open maps.');
          console.warn('Cannot open URL:', url);
        }
      } catch (e: any) {
        console.error('Error opening maps:', e);
        Alert.alert('Error', `Could not open maps: ${e.message || e}`);
      }
    },
    [keychainStartLocation, deviceLocation] // Now depends on both possible start locations
  );

  const fetchPlaceReviews = useCallback(async (placeId: string) => {
    setFetchingReviews(true);
    setReviewsError(null);
    try {
      const url = `${Strings.NEARBY_PLACES_DETAILS_API_URL}?place_id=${placeId}&key=${Strings.GOMAPS_API_KEY}`;
      console.log('Fetching Place Details API:', url);
      const res = await fetch(url);
      const data = await res.json();

      if (data.result) {
        // Map the PlaceResult data to DetailedPlaceItem
        const detailedPlace: DetailedPlaceItem = {
          id: data.result.place_id,
          title: data.result.name,
          description: data.result.types?.map((t: string) => t.replace(/_/g, ' ')).join(', ') || 'Unknown',
          address: data.result.vicinity || data.result.formatted_address || 'No address',
          coordinate: { latitude: data.result.geometry.location.lat, longitude: data.result.geometry.location.lng },
          rating: data.result.rating ?? null,
          isOpen: data.result.opening_hours?.open_now ?? null,
          iconUrl: data.result.icon || null,
          distanceKm: selectedPlaceDetails?.distanceKm || 'N/A', // Keep original distance if available
          reviews: data.result.reviews || [],
          formatted_phone_number: data.result.formatted_phone_number,
          website: data.result.website,
          url: data.result.url,
        };
        setSelectedPlaceDetails(detailedPlace);
      } else {
        setReviewsError(`Failed to fetch details: ${data.status || 'Unknown status'}`);
      }
    } catch (e: any) {
      console.error('Fetch place details error', e);
      setReviewsError(`Failed to load reviews: ${e.message || e}`);
    } finally {
      setFetchingReviews(false);
    }
  }, [selectedPlaceDetails]); // Added selectedPlaceDetails to dependencies for distanceKm

  const handleShowReviews = useCallback((item: PlaceItem) => {
    // Initialize selectedPlaceDetails with basic info from PlaceItem
    setSelectedPlaceDetails({ ...item });
    setShowReviewsModal(true);
    fetchPlaceReviews(item.id); // Fetch full details for the modal
  }, [fetchPlaceReviews]);


  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const loc = { latitude, longitude };
      setDeviceLocation(loc); // Store the prop location as deviceLocation
      fetchPlaces(loc); // Fetch places based on this device location
    } else {
      setError('Location not provided.');
      setLoading(false);
      setLocations([]);
      setDeviceLocation(null); // Clear device location if not provided
    }
  }, [latitude, longitude, fetchPlaces]);


  const renderListItem = useCallback(
    (item: PlaceItem) => (
      <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
        <View style={styles.textContent}>
          <View style={styles.titleRow}>
            {item.iconUrl && <Image source={{ uri: item.iconUrl }} style={styles.cardIcon} />}
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
          <Text style={styles.cardAddress} numberOfLines={1}>
            {item.address}
          </Text>
          <View style={styles.infoRow}>
            {item.rating != null && <Text style={styles.cardRating}>⭐ {item.rating}</Text>}
            <Text
              style={[
                styles.cardStatus,
                item.isOpen == null ? styles.cardStatusUnknown : item.isOpen ? styles.openStatus : styles.closedStatus,
              ]}
            >
              {item.isOpen == null ? 'Unknown' : item.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.buttonRow}>
            <Text style={styles.cardDistance}>{item.distanceKm} Km</Text>
            <TouchableOpacity style={styles.showReviewButton} onPress={() => handleShowReviews(item)}>
              <Text style={styles.showReviewButtonText}>Show Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directionButton} onPress={() => openGoogleMapsDirections(item)}>
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [openGoogleMapsDirections, handleShowReviews]
  );

  // --- Main List Rendering (Corrected) ---
  const renderEmptyList = useCallback(() => {
    if (loading && latitude !== null && longitude !== null) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Fetching nearby places for your location…</Text>
        </View>
      );
    }
    if (error) { // If there's an error, display it regardless of location presence
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    }
    if (latitude === null || longitude === null) {
      return (
        <View style={styles.centered}>
          <Text style={styles.infoText}>Please provide your location to see nearby places.</Text>
        </View>
      );
    }
    // If not loading, no error, and no location provided (or no results)
    return (
      <View style={styles.noResultsContainer}>
        <Text style={styles.noResultsText}>No results found.</Text>
      </View>
    );
  }, [loading, error, latitude, longitude]);


  return (
    <View style={styles.container}>
      <FlatList // Using FlatList for the main list
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderListItem(item)}
        showsVerticalScrollIndicator={!disableScroll}
        scrollEnabled={!disableScroll}
        contentContainerStyle={styles.flatListContainer}
        ListEmptyComponent={renderEmptyList()} // Use the dedicated empty component
      />

      {/* Moved general error display outside FlatList as a persistent bar */}
      {error && locations.length > 0 && (
        <View style={styles.bottomErrorBar}>
          <Text style={styles.bottomErrorText}>Warning: {error}</Text>
        </View>
      )}

      {/* Reviews Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReviewsModal}
        onRequestClose={() => {
          setShowReviewsModal(false);
          setSelectedPlaceDetails(null);
          setReviewsError(null);
        }}
      >
        <Pressable
          style={styles.centeredView}
          onPress={() => {
            // Close modal when pressing outside, but ensure content itself doesn't close it
            setShowReviewsModal(false);
            setSelectedPlaceDetails(null);
            setReviewsError(null);
          }}
        >
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>
              Reviews for {selectedPlaceDetails?.title || 'Selected Place'}
            </Text>

            {fetchingReviews ? (
              <View style={styles.modalLoading}>

                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Fetching reviews...</Text>
              </View>
            ) : reviewsError ? (
              <Text style={styles.modalErrorText}>Error: {reviewsError}</Text>
            ) : (
              // Conditional rendering for reviews list or "No reviews" message
              (selectedPlaceDetails?.reviews && selectedPlaceDetails.reviews.length > 0) ? (
                <FlatList
                  data={selectedPlaceDetails.reviews}
                  keyExtractor={(item, idx) => `${item.time}-${idx}`}
                  renderItem={({ item }) => (
                    <View style={styles.reviewCardModal}> {/* Use a distinct style for modal review cards */}
                      <View style={styles.reviewHeaderModal}>
                        {item.profile_photo_url && (
                          <Image
                            source={{ uri: item.profile_photo_url }}
                            style={styles.profilePhotoModal}
                          />
                        )}
                        <View style={{ flex: 1 }}> {/* Added flex:1 to contain text */}
                          <Text style={styles.authorNameModal}>{item.author_name || 'Anonymous'}</Text>
                          <Text style={styles.reviewRatingModal}>{`Rating: ${item.rating}/5`}</Text>
                          <Text style={styles.reviewTimeModal}>{item.relative_time_description}</Text>
                        </View>
                      </View>
                      <Text style={styles.reviewTextModal}>{item.text}</Text>
                    </View>
                  )}
                  style={styles.modalReviewsFlatList} // Apply styles to FlatList itself
                  contentContainerStyle={styles.modalReviewsFlatListContent}
                />
              ) : (
                <View style={styles.noReviewsContainerModal}>
                  <Text style={styles.noReviewsTextModal}>No reviews found for this place.</Text>
                </View>
              )
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setShowReviewsModal(false);
                setSelectedPlaceDetails(null);
                setReviewsError(null);
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { color: 'red', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  infoText: { fontSize: 16, color: '#888', textAlign: 'center' },
  flatListContainer: { paddingVertical: 2, paddingHorizontal: 5, flexGrow: 1 }, // Used for FlatList content
  card: {
    flexDirection: 'column',
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    marginVertical: 3,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContent: { flex: 1, padding: 10, justifyContent: 'space-between' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  cardIcon: { width: 20, height: 20, marginRight: 5, resizeMode: 'contain' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', flexShrink: 1 },
  cardAddress: { fontSize: 12, color: '#666', marginBottom: 5 },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  cardRating: { fontSize: 12, fontWeight: 'bold', color: '#FFD700' },
  cardStatus: { fontSize: 12, fontWeight: 'bold' },
  openStatus: { color: 'green' },
  closedStatus: { color: 'red' },
  cardStatusUnknown: { color: '#888' },
  cardDescription: { fontSize: 10, color: '#444' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  cardDistance: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  directionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
  },
  directionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  showReviewButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 5,
  },
  showReviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }, // For main list empty state
  noResultsText: { fontSize: 16, color: '#888' },
  bottomErrorBar: {
    backgroundColor: 'rgba(255, 99, 71, 0.8)',
    padding: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bottomErrorText: { color: 'white', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },

  // Modal Styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%', // Limit modal height
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalReviewsFlatList: { // Style for the FlatList component itself
    width: '100%',
    flexGrow: 1, // Allow FlatList to take available vertical space
    marginBottom: 15,
  },
  modalReviewsFlatListContent: { // Style for the content INSIDE the FlatList (when there are items)
    paddingBottom: 10, // Add some padding at the bottom of the list
  },
  noReviewsContainerModal: { // For centering the "No reviews" text inside modal
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  reviewCardModal: { // Distinct style for reviews inside the modal
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  reviewHeaderModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePhotoModal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  authorNameModal: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  reviewRatingModal: {
    fontSize: 13,
    color: '#555', // Change color if you want stars to be yellow
    marginTop: 2,
  },
  reviewTimeModal: {
    fontSize: 11,
    color: '#777',
  },
  reviewTextModal: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  noReviewsTextModal: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalLoading: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalErrorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  }
});

export default MapAndListView;