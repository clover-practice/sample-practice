import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { replace } from '../utils/NavigationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const OnboardingScreen = () => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log("TOKEN IS ", token);

        setTimeout(() => {
          if (token === "true1s") {
            replace('MainApp'); // User is logged in
          } else {
            replace('Login'); // Not logged in
          }
        }, 1500); // Simulated splash delay
      } catch (error) {
        replace('Login'); // Fallback in case of error
      }
    };

    checkLoginStatus(); // 👈 This must be inside useEffect
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


