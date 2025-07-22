import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

const NearbySearch = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Request location permission and get current location
    // This is a placeholder; implement actual location fetching here
    setLocation({ latitude: 19.0760, longitude: 72.8777 });
  }, []);

  const fetchNearbyPlaces = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/search.json?lon=${location.longitude}&lat=${location.latitude}&radius=1000&key=veHjzohf0Mwt9zdztTsw`
      );
      const data = await response.json();
      setPlaces(data.features);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView style={{ flex: 1 }}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[location?.longitude, location?.latitude]}
        />
        {places.map((place, index) => (
          <MapboxGL.PointAnnotation
            key={index}
            id={place.id}
            coordinate={[place.geometry.coordinates[0], place.geometry.coordinates[1]]}
          >
            <View style={{ backgroundColor: 'red', padding: 5 }}>
              <Text style={{ color: 'white' }}>{place.text}</Text>
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>
      <Button title="Find Nearby Places" onPress={fetchNearbyPlaces} />
    </View>
  );
};

export default NearbySearch;
