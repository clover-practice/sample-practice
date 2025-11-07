import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  NativeModules,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import {replace} from '../utils/NavigationUtils';
import {getValue} from '../utils/keychainStorage';
import Constants from '../constants/Constants';
import ArcLoader from '../components/spinner/ArcLoader';
import navigationString from '../constants/navigationString';
import JailMonkey from 'jail-monkey';
import OnboardingItem from '../components/OnboardingItem';
import {SlideData, SLIDES} from '../data/products';
import {width} from '../styles/responsiveSize';

const {DeveloperMode} = NativeModules;

const OnboardingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList<SlideData>>(null);

  useEffect(() => {
    // checkDevMode();
    // (async () => {
    //   await checkDeviceSecurity();
    // })();
  }, []);

  async function checkDevMode() {
    try {
      if (Platform.OS === 'android') {
        const enabled = await DeveloperMode.isDeveloperModeEnabled();
        if (enabled) {
          setDevModeEnabled(true);
        } else {
          setLoading(true);
          checkLoginStatus();
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
    console.log('isLoggedIn', isLoggedIn);
    setTimeout(() => {
      if (isLoggedIn === true) {
        replace(navigationString.MAIN_APP);
      } else {
        replace(navigationString.LOGIN);
      }
    }, 1500);
  };

  const exitApp = () => BackHandler.exitApp();

  const proceedApp = () => {
    setDevModeEnabled(false);
    replace(navigationString.MAIN_APP);
  };

  const checkDeviceSecurity = async () => {
    if (JailMonkey.isJailBroken()) {
      Alert.alert(
        '⚠️ Security Warning',
        'This device is jailbroken or rooted. The app will exit.',
        [{text: 'Exit', onPress: () => BackHandler.exitApp()}],
      );
      return;
    }

    if (JailMonkey.isOnExternalStorage()) {
      Alert.alert(
        '⚠️ Security Warning',
        'App is running on external storage. Please install on internal storage.',
      );
    }

    if (JailMonkey.hookDetected()) {
      Alert.alert('⚠️ Security Warning', 'App hook/tamper detected!');
    }

    const debugged = await JailMonkey.isDebuggedMode();
    if (debugged) {
      Alert.alert(
        '⚠️ Warning',
        'Debugger detected. App may not function securely.',
      );
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const scrollToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      replace(navigationString.LOGIN);
    }
  };

  const renderItem = ({item}: {item: SlideData}) => (
    <OnboardingItem {...item} />
  );

  const Pagination: React.FC = () => (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, index) => (
        <View
          key={index.toString()}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content" // or "dark-content"
        backgroundColor="#0C0C0C" // only affects Android
      />
      <View style={styles.container}>
        {/* Main Slides */}
        <FlatList
          data={SLIDES}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          ref={slidesRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />

        {/* Bottom Controls */}
        <View style={styles.bottomRow}>
          <Pagination />
          <View style={styles.bottomRow}>
            {/* Skip Button */}
            {currentIndex < SLIDES.length - 1 && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => replace(navigationString.LOGIN)}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={scrollToNext} style={styles.nextButton}>
              <Text style={styles.nextText}>
                {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loader */}
        {/* {loading && <ArcLoader />} */}

        {/* Dev Mode Modal */}
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
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0C0C0C',
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  // Pagination + Buttons
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#0C0C0C',
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FAFAFA',
    width: 20,
  },
  inactiveDot: {
    backgroundColor: '#404040',
  },
  nextButton: {
    backgroundColor: '#CFAE6E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  nextText: {
    color: '#171717',
    fontSize: 14,
  },
  skipButton: {
    right: 20,
    padding: 10,
    backgroundColor: '#404040',
    borderRadius: 20,
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: 'normal',
    paddingHorizontal: 10,
    color: '#A3A3A3',
  },
  // Modal
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
