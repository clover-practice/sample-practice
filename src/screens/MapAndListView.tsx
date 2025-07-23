import React, { useState, useRef, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { getDistance } from 'geolib'; // ✅ install with `npm install geolib` or `yarn add geolib`

// Local Imports
import Strings from '../constants/Constants';

interface PlaceItem {
  id: string;
  title: string;
  description: string;
  address: string;
  coordinate: { latitude: number; longitude: number };
  rating: number | null;
  isOpen: boolean | null;
  iconUrl: string | null;
  distanceKm: string; // NEW: distance as string (e.g. "2.3")
}

interface MapAndListViewProps {
  latitude: number | null;
  longitude: number | null;
  disableScroll?: boolean;
}

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height / 5;
const CARD_WIDTH = width - 10;
const NEARBY_SEARCH_RADIUS = '5000';

const MapAndListView: React.FC<MapAndListViewProps> = ({
  latitude,
  longitude,
  disableScroll = false,
}) => {
  const [locations, setLocations] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchPlaces = useCallback(
    async (loc: { latitude: number; longitude: number }) => {
      setLoading(true);
      setError(null);

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
              id: place.place_id || `${coord.lat}-${coord.lng}`,
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
          setLocations(mapped);
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
      if (!currentLocation) {
        Alert.alert('Error', 'Cannot get directions as your current location is not available.');
        return;
      }
      const src = currentLocation;
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
    [currentLocation]
  );

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const loc = { latitude, longitude };
      setCurrentLocation(loc);
      fetchPlaces(loc);
    } else {
      setError('Location not provided.');
      setLoading(false);
      setLocations([]);
      setCurrentLocation(null);
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
            <Text style={styles.cardDistance}>{item.distanceKm} km</Text>
            <TouchableOpacity style={styles.directionButton} onPress={() => openGoogleMapsDirections(item)}>
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [openGoogleMapsDirections]
  );

  if (loading && locations.length === 0 && latitude !== null && longitude !== null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching nearby places for your location…</Text>
      </View>
    );
  }

  if (error && locations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if ((latitude === null || longitude === null) && !loading && !error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>Please provide your location to see nearby places.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={!disableScroll} scrollEnabled={!disableScroll} contentContainerStyle={styles.flatListContainer}>
        {locations.length > 0 ? renderListItem(locations[0]) && locations.map(renderListItem) : !loading && !error && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found.</Text>
          </View>
        )}
      </ScrollView>
      {error && locations.length > 0 && (
        <View style={styles.bottomErrorBar}>
          <Text style={styles.bottomErrorText}>Warning: {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { color: 'red', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  infoText: { fontSize: 16, color: '#888', textAlign: 'center' },
  flatListContainer: { paddingVertical: 2, paddingHorizontal: 5, flexGrow: 1 },
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
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDistance: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  directionButton: { backgroundColor: '#007bff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5 },
  directionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
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
});

export default MapAndListView;
