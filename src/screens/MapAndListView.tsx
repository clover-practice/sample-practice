import React, { useState, useRef, useEffect } from 'react';
import {
  View, StyleSheet, FlatList, Dimensions, Text,
  TouchableOpacity, Image, ActivityIndicator,
  Alert, Platform, Linking,
} from 'react-native';

interface PlaceItem {
  id: string;
  title: string;
  description: string;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number | null;
  isOpen: boolean | null;
  iconUrl: string | null;
}

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height / 5;
const CARD_WIDTH = width - 10;

const GOOGLE_API_KEY = 'AlzaSyHbXxV_iKjbmuS9F2kTeHuMdpp6j0UGYOe';
const PLACES_API_URL = 'https://maps.gomaps.pro/maps/api/place/nearbysearch/json';

const MANILA_LOCATION = {
  latitude: 14.599512,
  longitude: 120.984222,
};

const MapAndListView: React.FC = () => {
  const flatListRef = useRef<FlatList<PlaceItem>>(null);
  const [locations, setLocations] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces(MANILA_LOCATION);
  }, []);

  const fetchPlaces = async (loc: typeof MANILA_LOCATION) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        location: `${loc.latitude},${loc.longitude}`,
        radius: '9000',
        name: 'brunos',
        key: GOOGLE_API_KEY,
      });
      const res = await fetch(`${PLACES_API_URL}?${params}`);
      const data = await res.json();

      if (data.results) {
        const mapped = data.results.map((place: { place_id: any; name: any; types: any[]; vicinity: any; geometry: { location: { lat: any; lng: any; }; }; rating: any; opening_hours: { open_now: any; }; icon: any; }, i: any) => ({
          id: place.place_id || String(i),
          title: place.name,
          description: place.types?.join(', ').replace(/_/g, ' ') || 'Unknown',
          address: place.vicinity || 'No address',
          coordinate: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
          rating: place.rating ?? null,
          isOpen: place.opening_hours?.open_now ?? null,
          iconUrl: place.icon || null,
        }));
        setLocations(mapped);
        setError(null);
      } else if (data.status === 'ZERO_RESULTS') {
        setError('No "Brunos" found near Manila.');
        setLocations([]);
      } else {
        setError(`Places API error: ${data.status}`);
        setLocations([]);
      }
    } catch (e) {
      console.error(e);
      setError(`Failed to load: ${e}`);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMapsDirections = async (destItem: PlaceItem) => {
    const src = MANILA_LOCATION;
    const dest = destItem.coordinate;
    const url = Platform.select({
      ios: `maps://?saddr=${src.latitude},${src.longitude}&daddr=${dest.latitude},${dest.longitude}&dirflg=d`,
      android: `https://www.google.com/maps/dir/?api=1&origin=${src.latitude},${src.longitude}&destination=${dest.latitude},${dest.longitude}&travelmode=driving`,
    });
    try {
      if (url && await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No map app available.');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not open maps.');
    }
  };

  const renderListItem = ({ item }: { item: PlaceItem }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.textContent}>
        <View style={styles.titleRow}>
          {item.iconUrl && <Image source={{ uri: item.iconUrl }} style={styles.cardIcon} />}
          <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
        </View>
        <Text numberOfLines={1} style={styles.cardAddress}>{item.address}</Text>
        <View style={styles.infoRow}>
          {item.rating != null && <Text style={styles.cardRating}>⭐ {item.rating}</Text>}
          <Text style={[
            styles.cardStatus,
            item.isOpen == null ? styles.cardStatusUnknown :
            item.isOpen ? styles.openStatus : styles.closedStatus
          ]}>
            {item.isOpen == null ? 'Unknown' : item.isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
        <Text numberOfLines={2} style={styles.cardDescription}>{item.description}</Text>
        <TouchableOpacity
          style={styles.directionButton}
          onPress={() => openGoogleMapsDirections(item)}
        >
          <Text style={styles.directionButtonText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading nearby “Brunos” in Manila…</Text>
    </View>
  );

  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>Error: {error}</Text>
      <Text style={styles.errorSubText}>Please check your Google API settings.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={locations}
        showsVerticalScrollIndicator
        contentContainerStyle={styles.flatListContainer}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        ListEmptyComponent={() => (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found.</Text>
          </View>
        )}
      />
    </View>
  );
};
// Keep same styles as before
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { color: 'red', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  errorSubText: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 20 },
  flatListContainer: { paddingVertical: 2, paddingHorizontal: 5, flexGrow: 1 },
  card: {
    flexDirection: 'column', height: CARD_HEIGHT, width: CARD_WIDTH, overflow: 'hidden',
    marginVertical: 3, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25,
    shadowRadius: 3.84, elevation: 5,
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
  cardStatusUnknown: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  cardDescription: { fontSize: 10, color: '#444' },
  directionButton: {
    backgroundColor: '#007bff', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 5, alignSelf: 'flex-end', marginTop: 5,
  },
  directionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 10 },
  noResultsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  noResultsText: { fontSize: 16, color: '#888' },
});

export default MapAndListView;
