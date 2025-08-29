import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

import CustomHeader from '../components/CustomHeader';
import {goBack, navigate} from '../utils/NavigationUtils';
import colors from '../constants/colors';
import {setValue, getValue} from '../utils/keychainStorage';
import Constants from '../constants/Constants';
import AppTextInput from '../components/AppTextInput';
import navigationString from '../constants/navigationString';

const {width} = Dimensions.get('window');
const PRIMARY_COLOR = '#C00054';

const RegistrationScreen = () => {
  const [gender, setGender] = useState<'Male' | 'Female' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  useEffect(() => {
    const fetchMobile = async () => {
      const Mobile = await getValue(Constants.MOBILE_NUMBER);
      console.log('Fetched Mobile:', Mobile);
      setPhone(Mobile); // Set the fetched mobile number
      // You can use Mobile here, e.g., setPhone(Mobile)
    };
    fetchMobile();
  }, []);

  const handleKyc = async () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('GENDER:', gender);
    await setValue(Constants.KYC_DONE, true);
    await setValue(Constants.IS_LOGIN, true);
    await setValue(Constants.USER_NAME, name);
    await setValue(Constants.EMAIL, email);

    navigate(navigationString.MAIN_APP);
  };

  return (
    <View style={styles.safeArea}>
      <CustomHeader
        title="Customer KYC"
        showBack={true}
        onBackPress={() => goBack()}
      />

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <Image
            source={require('../assets/images/app_logo.png')} // Replace with your logo
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Full Name */}
          {/* <Text style={styles.label}></Text> */}
          <AppTextInput
            placeholder="Enter Full Name"
            label="Full Name"
            keyboardType="default"
            value={name}
            onChangeText={setName}
          />

          {/* Phone Number */}
          <AppTextInput
            placeholder="+91 1234567890"
            keyboardType="phone-pad"
            label="Phone Number"
            value={phone}
            // onChangeText={setPhone}
          />

          {/* Email */}
          <AppTextInput
            placeholder="email@example.com"
            keyboardType="email-address"
            label="Email"
            value={email}
            onChangeText={setEmail}
          />

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {['Female', 'Male'].map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => setGender(item as 'Male' | 'Female')}
                style={[
                  styles.genderButton,
                  gender === item && styles.genderButtonSelected,
                ]}>
                <Text
                  style={[
                    styles.genderText,
                    gender === item && styles.genderTextSelected,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Referral Code */}

          <AppTextInput
            placeholder="Enter Referral Code (Optional)"
            keyboardType="default"
            label="Referral Code"
          />

          {/* Proceed Button */}
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => handleKyc()}>
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.BACKGROUND || '#fff',
  },
  logo: {
    width: width * 0.6,
    height: 80,
    alignSelf: 'center',
    marginVertical: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  genderText: {
    fontSize: 16,
    color: '#000',
  },
  genderTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
