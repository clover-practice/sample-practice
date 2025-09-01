import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {replace} from '../utils/NavigationUtils';
import {getValue} from '../utils/keychainStorage';
import Constants from '../constants/Constants';
import ArcLoader from '../components/spinner/ArcLoader';
import navigationString from '../constants/navigationString';
import {NativeModules} from 'react-native';

const {DeveloperMode} = NativeModules;

const OnboardingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(false);

  useEffect(() => {
    checkDevMode();
  }, []);

  async function checkDevMode() {
    try {
      if (Platform.OS === 'android') {
        const enabled = await DeveloperMode.isDeveloperModeEnabled();
        if (enabled) {
          setDevModeEnabled(true); // show bottom sheet
        } else {
          setLoading(true);
          checkLoginStatus(); // normal flow
        }
      } else {
        setLoading(true);
        checkLoginStatus();
      }
    } catch (err) {
      console.error(err);
    }
  }
  const checkLoginStatus = async () => {
    const isLoggedIn = await getValue(Constants.IS_LOGIN);
    setTimeout(() => {
      if (isLoggedIn === true) {
        replace(navigationString.MAIN_APP);
      } else {
        replace(navigationString.LOGIN);
      }
    }, 1500);
  };

  const exitApp = () => {
    BackHandler.exitApp();
  };

  const proceedApp = () => {
    setDevModeEnabled(false);
    replace(navigationString.MAIN_APP); // direct navigation
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/app_logo.png')} />
      {loading && <ArcLoader />}

      {/* 🚨 BottomSheet Modal when Dev Mode is ON */}
      <Modal
        transparent
        animationType="slide"
        visible={devModeEnabled}
        onRequestClose={exitApp}>
        <View style={styles.modalBackground}>
          <View style={styles.sheet}>
            <Text style={styles.title}>⚠️ Developer Mode Detected</Text>
            <Text style={styles.desc}>
              Developer Mode is enabled. Do you want to continue?
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.exitBtn]}
                onPress={exitApp}>
                <Text style={styles.buttonText}>Exit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.okBtn]}
                onPress={proceedApp}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  exitBtn: {
    backgroundColor: 'red',
  },
  okBtn: {
    backgroundColor: 'green',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   Image,
//   Alert,
// } from 'react-native';
// import {replace} from '../utils/NavigationUtils';
// import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'; // <--- ADD these imports
// import {getValue} from '../utils/keychainStorage';
// import Constants from '../constants/Constants';
// import CustomLoader from '../components/spinner/CustomLoader';
// import TailSpinnerLoader from '../components/spinner/ TailSpinnerLoader';
// import TailEffectLoader from '../components/spinner/TailEffectLoader';
// import ProgressBarWithPercent from '../components/spinner/ProgressBar';
// import DottedLoader from '../components/spinner/DottedLoader';
// import ArcLoader from '../components/spinner/ArcLoader';
// import navigationString from '../constants/navigationString';
// import {NativeModules} from 'react-native';

// const {DeveloperMode} = NativeModules;
// const OnboardingScreen = () => {
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//     checkDevMode();
//     setLoading(true);
//     checkLoginStatus();
//   }, []);

//   const checkLoginStatus = async () => {
//     const isLoggedIn = await getValue(Constants.IS_LOGIN);
//     console.log('TOKEN IS  isLoggedIn :- ', isLoggedIn);

//     setTimeout(() => {
//       if (isLoggedIn === true) {
//         setLoading(true);
//         replace(navigationString.MAIN_APP);
//       } else {
//         // replace('PermissionScreen');
//         replace(navigationString.LOGIN);
//       }
//       // replace('SmsReceive');
//     }, 1500);
//   };

//   async function checkDevMode() {
//     try {
//       const enabled = await DeveloperMode.isDeveloperModeEnabled();
//       if (enabled) {
//         Alert.alert('Warning', 'Developer Mode is enabled on this device!');
//       } else {
//         Alert.alert('OK', 'Developer Mode is disabled.');
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }
//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.title}>MyApp</Text> */}
//       <Image source={require('../assets/images/app_logo.png')} />
//       {/* <ActivityIndicator size="large" color="#0000ff" />
//       <CustomLoader visible={loading} />
//       <TailSpinnerLoader visible={loading} /> */}
//       {/* <TailEffectLoader visible={loading} /> */}
//       {/* <ProgressBarWithPercent progress={1} /> */}
//       {/* <StripedIndeterminateBar/> */}
//       <ArcLoader />
//       {/* <DottedLoader/> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
// });

// export default OnboardingScreen;
