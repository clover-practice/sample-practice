import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import {navigate} from '../utils/NavigationUtils';
import MobileNumberInput from '../components/NumberInput';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/colors';
import Constants from '../constants/Constants';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {request, PERMISSIONS} from 'react-native-permissions';
import {setValue, storeLocation} from '../utils/keychainStorage';

const hasLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return status === 'granted';
  } else {
    const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return status === 'granted';
  }
};

const getAddressFromLocation = async (lat: number, lon: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const {data} = await axios.get(url, {
    headers: {'User-Agent': 'YourAppName/1.0 (your@email.com)'},
  });
  return data;
};

const LoginScreen = () => {
  const [mobile, setMobile] = useState('');
  const [currentCity, setCurrentCity] = useState('Fetching location...');
  const isMobileValid = mobile.length === 10;

  useEffect(() => {
    const fetchAndStoreLocation = async () => {
      if (!(await hasLocationPermission())) {
        setCurrentCity('Permission Denied');
        return;
      }

      Geolocation.getCurrentPosition(
        async ({coords: {latitude, longitude}}) => {
          try {
            const response = await getAddressFromLocation(latitude, longitude);
            const addr = response.address || {};
            const city = addr.city || addr.village || addr.state || 'Unknown';
            setCurrentCity(city);
            const address = response.display_name || city;

            await storeLocation(latitude, longitude, city);
            await setValue(Constants.CITY_ADDRESS, city);
          } catch (e) {
            setCurrentCity('Address Unavailable');
          }
        },
        error => {
          setCurrentCity('Location Error');
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    fetchAndStoreLocation();
  }, []);

  const handleLogin = () => {
    navigate('OtpScreen', {mobile});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            <Text style={styles.header}>LoginScreen</Text>

            <MobileNumberInput value={mobile} onChange={setMobile} /> 
            <CustomButton
              title={Constants.CONTINUE}
              onPress={handleLogin}
              disabled={!isMobileValid}
              backgroundColor={isMobileValid ? Colors.PRIMARY : 'transparent'}
              textColor={isMobileValid ? Colors.WHITE : Colors.GRAY_DARK}
              style={styles.button}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  city: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
});
