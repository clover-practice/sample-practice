import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,TouchableOpacity } from 'react-native';
import { replace } from '../utils/NavigationUtils'; 
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // <--- ADD these imports   
import { getValue } from '../utils/keychainStorage';
import Constants from '../constants/Constants';

const OnboardingScreen = () => { 
useEffect(() => {
  const checkLoginStatus = async () => {
    const isLoggedIn = await getValue(Constants.IS_LOGIN);
    console.log("TOKEN IS  isLoggedIn :- ", isLoggedIn);
 
    setTimeout(() => {
      if (isLoggedIn === true) {
        replace('MainApp');
      } else {
        // replace('PermissionScreen');
       replace('Login');
      } 
    }, 1500);
  };

  checkLoginStatus();
}, []);



  return (
    <View style={styles.container}>
      <Text style={styles.title}>MyApp</Text>
      <ActivityIndicator size="large" color="#0000ff" />
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




// // screens/SplashScreen.js
// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { replace } from '../utils/NavigationUtils';

// const OnboardingScreen = () => {
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//        replace('Login'); // `replace` prevents going back to splash
//     }, 2000); // 2 seconds

//     return () => clearTimeout(timeout); // cleanup
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>MyApp</Text>
//       <ActivityIndicator size="large" color="#0000ff" />
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


