// import React, {useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   Easing,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

// const {width} = Dimensions.get('window');
// const BAR_WIDTH = width * 0.8;
// const BAR_HEIGHT = 12;

// const StripedIndeterminateBar: React.FC = () => {
//   const translateX = useRef(new Animated.Value(-BAR_WIDTH)).current;

//   useEffect(() => {
//     const loopAnimation = () => {
//       Animated.loop(
//         Animated.timing(translateX, {
//           toValue: BAR_WIDTH,
//           duration: 1000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         }),
//       ).start();
//     };
//     loopAnimation();
//   }, [translateX]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Loading</Text>
//       <View style={styles.barBackground}>
//         <Animated.View
//           style={[styles.animatedStripeContainer, {transform: [{translateX}]}]}>
//           <LinearGradient
//             colors={['#007BFF', '#4DA3FF']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 1}}
//             style={styles.stripe}
//           />
//         </Animated.View>
//       </View>
//     </View>
//   );
// };

// export default StripedIndeterminateBar;

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   label: {
//     fontWeight: 'bold',
//     marginBottom: 8,
//     fontSize: 16,
//   },
//   barBackground: {
//     width: BAR_WIDTH,
//     height: BAR_HEIGHT,
//     backgroundColor: '#e0e0e0',
//     borderRadius: BAR_HEIGHT / 2,
//     overflow: 'hidden',
//   },
//   animatedStripeContainer: {
//     position: 'absolute',
//     width: BAR_WIDTH * 2, // allow animation across full bar
//     height: '100%',
//   },
//   stripe: {
//     flex: 1,
//     width: '100%',
//     backgroundSize: 20,
//     opacity: 0.7,
//     backgroundColor: 'transparent',
//     backgroundRepeat: 'repeat',
//     // To simulate diagonal lines, use rotation in transform
//     transform: [{rotate: '45deg'}],
//   },
// });
