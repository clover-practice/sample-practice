// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Platform,
//   PermissionsAndroid,
//   Text,
//   View,
//   Button,
// } from 'react-native';
// import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
// import axios from 'axios';

// export default function GoogleMap() {
//   const [location, setLocation] = useState<GeoPosition | null>(null);
//   const [address, setAddress] = useState<string | null>(null);

//   // iOS permission
//   const hasPermissionIOS = async () => {
//     const status = await Geolocation.requestAuthorization('whenInUse');
//     return status === 'granted';
//   };

//   // Cross-platform permission
//   const hasLocationPermission = async () => {
//     if (Platform.OS === 'ios') {
//       return await hasPermissionIOS();
//     }

//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'This app needs access to your location.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };

//   // Reverse geocoding
//   const getAddressFromCoords = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
//       );
//       const fullAddress = response.data.display_name;
//       setAddress(fullAddress);
//     } catch (error) {
//       console.error('Reverse geocoding failed:', error);
//       setAddress('Unable to fetch address');
//     }
//   };

//   // Get location
//   const getLocation = async () => {
//     const hasPermission = await hasLocationPermission();
//     if (!hasPermission) {
//       setAddress('Location permission not granted');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       (position) => {
//         setLocation(position);
//         const { latitude, longitude } = position.coords;
//         getAddressFromCoords(latitude, longitude);
//       },
//       (error) => {
//         console.warn('Location error:', error.code, error.message);
//         setAddress('Location error');
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//         forceRequestLocation: true,
//       }
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Get Location & Address" onPress={getLocation} />
//       {location && (
//         <Text>
//           Latitude: {location.coords.latitude}, Longitude:{' '}
//           {location.coords.longitude}
//         </Text>
//       )}
//       {address && <Text style={{ marginTop: 10 }}>{address}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
// });
