import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {replace} from '../utils/NavigationUtils';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'; // <--- ADD these imports
import {getValue} from '../utils/keychainStorage';
import Constants from '../constants/Constants';
import CustomLoader from '../components/spinner/CustomLoader';
import TailSpinnerLoader from '../components/spinner/ TailSpinnerLoader';
import TailEffectLoader from '../components/spinner/TailEffectLoader';
import ProgressBarWithPercent from '../components/spinner/ProgressBar';
import DottedLoader from '../components/spinner/DottedLoader';
import ArcLoader from '../components/spinner/ArcLoader';
import navigationString from '../constants/navigationString';

const OnboardingScreen = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const isLoggedIn = await getValue(Constants.IS_LOGIN);
    console.log('TOKEN IS  isLoggedIn :- ', isLoggedIn);

    setTimeout(() => {
      if (isLoggedIn === true) {
        setLoading(true);
        replace(navigationString.MAIN_APP);
      } else {
        // replace('PermissionScreen');
        replace(navigationString.LOGIN);
      }
      // replace('SmsReceive');
    }, 1500);
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>MyApp</Text> */}
      <Image source={require('../assets/images/app_logo.png')} />
      {/* <ActivityIndicator size="large" color="#0000ff" />
      <CustomLoader visible={loading} />
      <TailSpinnerLoader visible={loading} /> */}
      {/* <TailEffectLoader visible={loading} /> */}
      {/* <ProgressBarWithPercent progress={1} /> */}
      {/* <StripedIndeterminateBar/> */}
      <ArcLoader />
      {/* <DottedLoader/> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default OnboardingScreen;
