// screens/LoginScreen.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import React,{useState} from 'react'; 
import { navigate, replace } from '../utils/NavigationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import MobileNumberInput from '../components/NumberInput';

const LoginScreen = () => { 
  const [quantity, setQuantity] = useState(1);
    const [mobile, setMobile] = useState('');
  // const handleLogin = () => {
  //   login(); // ✅ Set isAuthenticated to true
  //    replace('MainApp'); // or 'Dashboard' or whatever your target screen is
  // };

  const handleLogin = async () => {
    await AsyncStorage.setItem('userToken',  "true");
    // replace('MainApp');
    navigate('OtpScreen',{ mobile: mobile });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,padding:20,backgroundColor:'#fff'}}>
      <Text style={{marginBottom:30}}>LoginScreen</Text>
        <MobileNumberInput
        value={mobile}
        onChange={setMobile}
        prefix="+91"
        maxLength={10}
      />
      <TouchableOpacity
        style={{
          backgroundColor: 'dodgerblue',
          width: '100%',
          paddingVertical: 15,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop:30,
          borderRadius: 8,
        }}
        onPress={handleLogin}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          Send Otp
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
