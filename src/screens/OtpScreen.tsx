import React, {useEffect, useState} from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import OtpInput from '../components/OtpInput';
import {goBack, navigate, replace} from '../utils/NavigationUtils';
import {getValue, setValue} from '../utils/keychainStorage';
import Constants from '../constants/Constants';

type RootStackParamList = {
  OtpScreen: {mobile: string};
};

type OtpScreenRouteProp = RouteProp<RootStackParamList, 'OtpScreen'>;

const OtpScreen = () => {
  const [otp, setOtp] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const route = useRoute<OtpScreenRouteProp>();
  const mobile = route.params?.mobile ?? '';

  useEffect(() => {
    console.log('Received mobile:', mobile);
    if (otp.length === 6 && !hasSubmitted) {
      handleSubmitOtp();
    }
  }, [mobile, otp]);

  const handleSubmitOtp = async () => {
    setHasSubmitted(true); // prevent double-submit
    console.log('🔐 Submitting OTP:', otp);
    const kycDone = await getValue(Constants.KYC_DONE);
    if (kycDone === true) {
      navigate('MainApp');
    } else {
      navigate('RegistrationScreen');
    }
  };

  return (
    
      <View style={styles.container}>
        <CustomHeader
          title="Login with OTP"
          showBack={true}
          onBackPress={goBack}
        />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.otpInfoText}>
                {mobile
                  ? `An OTP has been sent to your mobile number\n+91 ${mobile}`
                  : 'An OTP has been sent to your mobile number.'}
              </Text>

              <OtpInput value={otp} onChange={setOtp} />
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
    fontSize: Platform.OS === 'android' ? 18 : 15,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
});

