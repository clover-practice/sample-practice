import React, { useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import OtpInput from '../components/OtpInput';
import { goBack, navigate } from '../utils/NavigationUtils';
import CustomHeader from '../components/CustomHeader';
import { useRoute, RouteProp } from '@react-navigation/native';

// Define expected route parameters
type RootStackParamList = {
  OtpScreen: { mobile: string };
};

// Route prop type for this screen
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

const OtpScreen = () => {
  const route = useRoute<OtpScreenRouteProp>();
  const mobile = route.params?.mobile ?? ''; // Fallback to empty string if undefined

  useEffect(() => {
    console.log('Mobile number received:', mobile);
  }, [mobile]);

  const handleLogin = () => {
    navigate('MainApp');
  };

  return (
    <View style={styles.container}>
      <CustomHeader showBack={true} onBackPress={goBack} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.otpInfoText}>
              {mobile
                ? `An OTP has been sent to your mobile number\n+91 ${mobile}`
                : 'An OTP has been sent to your mobile number.'}
            </Text>

            <OtpInput />

            <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  otpInfoText: {
    fontSize: Platform.OS==='android' ? 18 :15,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: 'dodgerblue',
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: Platform.OS==='android' ? 18 :16,
  },
});
