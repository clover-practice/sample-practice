import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {replace} from '../utils/NavigationUtils';
import navigationString from '../constants/navigationString';

const LOGO_SLIDE_DISTANCE = -40; // Logo slides up 40 pixels
const HOLD_DURATION = 700; // Time the logo stays in the slightly raised position

const SplashScreen: React.FC = () => {
  // Use scaleAnim and slideAnim, but initialize scale to 1 (normal)
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  // We'll set the initial opacity in styles to 1, removing fadeAnim.

  useEffect(() => {
    // Phase 1: Slide UP from center (0 -> -40)
    Animated.timing(slideAnim, {
      toValue: LOGO_SLIDE_DISTANCE, // Move up by 40px
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Hold for a moment (Logo is slightly raised)
      setTimeout(() => {
        // Phase 2: Slide Down to center (-40 -> 0)
        Animated.timing(slideAnim, {
          toValue: 0, // Slide back DOWN to the center (0)
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          // Phase 3: Rapid Massive Zoom/Sweep Out
          Animated.timing(scaleAnim, {
            toValue: 20, // Massive zoom to sweep the screen (The key transition)
            duration: 800,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            // Phase 4: Navigate after animation completes
            replace(navigationString.ON_BORDING);
          });
        });
      }, HOLD_DURATION); // Wait 700ms while the logo is up
    });

    // Cleanup function
    return () => {
      scaleAnim.stopAnimation();
      slideAnim.stopAnimation();
    };
  }, [scaleAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/logo.png')} // Verify path
        style={[
          styles.logo,
          {
            // Initial opacity is 1 (fully visible)
            opacity: 1,
            // Apply scale and translate animations
            transform: [{scale: scaleAnim}, {translateY: slideAnim}],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 180,
    height: 180,
  },
});

// import React, {useEffect, useRef} from 'react';
// import {View, StyleSheet, Animated, Easing} from 'react-native';
// import {replace} from '../utils/NavigationUtils';
// import navigationString from '../constants/navigationString';

// const SplashScreen: React.FC = () => {
//   // Animated.Value is used to drive the animation
//   const fadeAnim = useRef(new Animated.Value(0)).current; // controls logo opacity
//   const scaleAnim = useRef(new Animated.Value(0.5)).current; // controls logo scale (starting slightly smaller)

//   useEffect(() => {
//     // Phase 1: Fade-in and zoom-in to normal size (Initial presentation)
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1, // Fade in
//         duration: 800,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 1, // Zoom to normal size (180x180)
//         duration: 800,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       // Hold for a moment (Logo is fully visible)
//       setTimeout(() => {
//         // Phase 2: Rapid Fade-out and Massive Zoom-out/Zoom-in (The sweeping transition)
//         // We will zoom the scale out to a very large number (e.g., 20) to cover the screen
//         Animated.parallel([
//           Animated.timing(fadeAnim, {
//             toValue: 0, // Fade out
//             duration: 600, // Quick animation
//             easing: Easing.in(Easing.cubic),
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleAnim, {
//             toValue: 20, // Massive zoom to sweep the screen (The key change!)
//             duration: 600, // Quick animation
//             easing: Easing.in(Easing.ease),
//             useNativeDriver: true,
//           }),
//         ]).start(() => {
//           // Phase 3: Navigate after animation completes
//           // replace(navigationString.ON_BORDING);
//         });
//       }, 1000); // Wait 1 second (1000ms) before the sweep starts
//     });

//     // Cleanup function to stop animations if the screen is somehow unmounted early
//     return () => {
//       fadeAnim.stopAnimation();
//       scaleAnim.stopAnimation();
//     };
//   }, [fadeAnim, scaleAnim]);

//   return (
//     <View style={styles.container}>
//       <Animated.Image
//         source={require('../assets/images/logo.png')} // **Verify this path is correct**
//         style={[
//           styles.logo,
//           {
//             opacity: fadeAnim,
//             transform: [{scale: scaleAnim}],
//           },
//         ]}
//         resizeMode="contain"
//       />
//       {/* Optional brand text below logo */}
//       {/* You can animate this text's opacity too, using fadeAnim */}
//       {/* <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
//         Bruno Barber
//       </Animated.Text> */}
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000', // Ensure this matches the background color of your app's first screen for a seamless look
//     alignItems: 'center',
//     justifyContent: 'center',
//     // Setting overflow: 'hidden' might prevent a brief white flash on some devices during the large scale transformation
//     overflow: 'hidden',
//   },
//   logo: {
//     width: 180,
//     height: 180,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: '700',
//     letterSpacing: 1,
//     marginTop: 12,
//   },
// });

// import {View, Image, StyleSheet, Animated, Easing} from 'react-native';
// import {replace} from '../utils/NavigationUtils';
// import navigationString from '../constants/navigationString';

// const SplashScreen: React.FC = () => {
//   const fadeAnim = useRef(new Animated.Value(0)).current; // controls logo opacity
//   const scaleAnim = useRef(new Animated.Value(1)).current; // controls logo scale

//   useEffect(() => {
//     // Step 1: Fade-in and zoom-in
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 800,
//         easing: Easing.out(Easing.exp),
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleAnim, {
//         toValue: 10,
//         duration: 800,
//         easing: Easing.out(Easing.ease),
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       // Hold for a moment
//       setTimeout(() => {
//         // Step 2: Fade-out and zoom-out
//         Animated.parallel([
//           Animated.timing(fadeAnim, {
//             toValue: 0,
//             duration: 700,
//             easing: Easing.in(Easing.ease),
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleAnim, {
//             toValue: 0.3,
//             duration: 700,
//             easing: Easing.in(Easing.exp),
//             useNativeDriver: true,
//           }),
//         ]).start(() => {
//           // Step 3: Navigate after animation completes
//           // replace(navigationString.ON_BORDING);
//         });
//       }, 700);
//     });
//   }, [fadeAnim, scaleAnim]);

//   return (
//     <View style={styles.container}>
//       <Animated.Image
//         source={require('../assets/images/logo.png')}
//         style={[
//           styles.logo,
//           {
//             opacity: fadeAnim,
//             transform: [{scale: scaleAnim}],
//           },
//         ]}
//         resizeMode="contain"
//       />
//       {/* Optional brand text below logo */}
//       {/* <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
//         Bruno Barber
//       </Animated.Text> */}
//     </View>
//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000', // background color of splash
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logo: {
//     width: 180,
//     height: 180,
//   },
//   text: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: '700',
//     letterSpacing: 1,
//     marginTop: 12,
//   },
// });
