// screens/LoginScreen.tsx
import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {navigate, replace} from '../utils/NavigationUtils';
import MobileNumberInput from '../components/NumberInput';
import CustomButton from '../components/CustomButton';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants from '../constants/Constants';

const LoginScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [mobile, setMobile] = useState('');

  const handleLogin = async () => {
    navigate('OtpScreen', {mobile: mobile});
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
      }}>
      <Text style={{marginBottom: 30}}>LoginScreen</Text>
      <MobileNumberInput value={mobile} onChange={setMobile} />

      <CustomButton
        title={Constants.SEND_OTP}
        onPress={() => handleLogin()}
        rightIcon={<Ionicons name="chevron-forward" size={20} color="white" />}
        style={{marginTop: 40}}
      />
    </View>
  );
};

export default LoginScreen;
