// screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { navigate } from '../utils/NavigationUtils';
import MobileNumberInput from '../components/NumberInput';
import CustomButton from '../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { setValue, storeLocation } from '../utils/keychainStorage';
import Constants from '../constants/Constants';

const getAddressFromLocation = async (lat: number, lon: number): Promise<any> => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'YourAppName/1.0 (your@email.com)' }
  });
  return data;
};

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const [currentCity, setCurrentCity] = useState<string>('Fetching location...');

  const fetchAndStoreLocation = () => {
    Geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const response = await getAddressFromLocation(latitude, longitude);
          const addr = response.address || {};
          const city = addr.city || addr.village || addr.state || 'Unknown';
          setCurrentCity(city);

          await storeLocation(latitude, longitude, city);
          await setValue(Constants.CITY_ADDRESS, city);
          console.log('✅ Location saved to Keychain');
        } catch (e) {
          console.warn('Geocoding error:', e);
          setCurrentCity('Address Unavailable');
        }
      },
      (error) => {
        console.warn('Location error:', error);
        setCurrentCity('Location Error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    fetchAndStoreLocation();
  }, []);

  const handleLogin = () => {
    navigate('OtpScreen', { mobile });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LoginScreen</Text>
     

      <MobileNumberInput value={mobile} onChange={setMobile} />

      <CustomButton
        title={Constants.SEND_OTP}
        onPress={handleLogin}
        rightIcon={<Ionicons name="chevron-forward" size={20} color="white" />}
        style={{ marginTop: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, marginBottom: 20 },
  city: { fontSize: 16, marginBottom: 30 },
});

export default LoginScreen;
