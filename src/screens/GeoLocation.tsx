// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Button,
//   PermissionsAndroid,
//   Platform,
//   StyleSheet,
// } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import axios from 'axios';

// const GOOGLE_API_KEY = 'AIzaSyCU-5Dt12O8RXtvYfpWa7bOxE4A17nfmkU'; // <-- actual API key

// const GeoLocation = () => {
//   const [location, setLocation] = useState('');
//   const [address, setAddress] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

// const requestLocationPermission = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: 'Location Permission',
//           message: 'App needs access to your location.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       console.log('Permission result:', granted);
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn('Permission error:', err);
//       return false;
//     }
//   }
//   return true;
// };

//   const getCurrentLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       setErrorMsg('Location permission denied');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       async position => {
//         console.log('Position:', position);
//         const coords = position.coords;
//         setLocation(coords);
//         setErrorMsg('');
//         await getAddressFromCoords(coords.latitude, coords.longitude);
//       },
//       error => {
//         console.error('Location error:', error.code, error.message);
//         setErrorMsg(error.message.toString());
//         setLocation('');
//         setAddress('');
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 10000,
//         forceRequestLocation: true,
//         showLocationDialog: true,
//       }
//     );
//   };

 
// const getAddressFromCoords = async (lat, lng) => {
//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
//     );

//     // ✅ Pretty-print the entire response
//     console.log('📦 Full Geocoding API Response:');
//     console.log(JSON.stringify(response.data, null, 2));

//     if (response.data.results.length > 0) {
//       const formattedAddress = response.data.results[0].formatted_address;
//       console.log('✅ Address:', formattedAddress);
//       setAddress(formattedAddress);
//     } else {
//       console.warn('⚠️ No address found. Status:', response.data.status);
//       setAddress(response.data.status);
//     }
//   } catch (error) {
//     console.error('❌ Geocoding API Error:', error.message);
//     setAddress('Failed to get address');
//   }
// };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Current Location</Text>
//       {location ? (
//         <>
//           <Text>Latitude: {location.latitude}</Text>
//           <Text>Longitude: {location.longitude}</Text>
//           <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Address:</Text>
//           <Text>{address}</Text>
//         </>
//       ) : (
//         <Text style={{ color: 'red' }}>{errorMsg ?? 'Getting location...'}</Text>
//       )}
//       <Button title="Refresh Location" onPress={getCurrentLocation} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 16,
//   },
// });

// export default GeoLocation;
