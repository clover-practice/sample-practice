// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   Dimensions,
// } from 'react-native';

// const {width} = Dimensions.get('window');

// interface Slide {
//   title: string;
//   subtitle: string;
//   imageUrl?: string;
// }

// interface BottomAlertProps {
//   visible: boolean;
//   onCancel?: () => void;
//   onFinish?: () => void;
// }

// const slides: Slide[] = [
//   {
//     title: 'Meet new friends with us',
//     subtitle: 'You can make new friends easily with our app.',
//     imageUrl: '../assets/images/home_page_alert.png',
//   },
//   {
//     title: 'Connect anytime',
//     subtitle: 'Stay connected with people you care about.',
//     imageUrl: '../assets/images/home_page_alert.png',
//   },
//   {
//     title: 'Get Started Today',
//     subtitle: 'Make your first connection right now!',
//     imageUrl: '../assets/images/home_page_alert.png',
//   },
// ];

// const BottomAlert: React.FC<BottomAlertProps> = ({
//   visible,
//   onCancel,
//   onFinish,
// }) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const currentSlide = slides[activeIndex];
//   const isLast = activeIndex === slides.length - 1;

//   const handleNext = () => {
//     if (isLast) {
//       onFinish?.();
//     } else {
//       setActiveIndex(prev => prev + 1);
//     }
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         <View style={styles.alertBox}>
//           {/* Image Section */}
//           <View style={styles.topContainer}>
//             <Image
//               source={require(currentSlide.imageUrl as string)}
//               style={styles.image}
//               resizeMode="contain"
//             />
//           </View>

//           {/* Bottom Section */}
//           <View style={styles.bottomContainer}>
//             <Text style={styles.title}>
//               {currentSlide.title.split(' ').map((word, i) => {
//                 if (word.toLowerCase() === 'friends') {
//                   return (
//                     <Text key={i} style={styles.highlight}>
//                       {word + ' '}
//                     </Text>
//                   );
//                 }
//                 return word + ' ';
//               })}
//             </Text>

//             <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

//             {/* Indicators */}
//             <View style={styles.indicatorContainer}>
//               {slides.map((_, i) => (
//                 <View
//                   key={i}
//                   style={[
//                     styles.indicator,
//                     i === activeIndex
//                       ? styles.activeIndicator
//                       : styles.inactiveIndicator,
//                   ]}
//                 />
//               ))}
//             </View>

//             {/* Buttons */}
//             <View style={styles.buttonRow}>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={onCancel}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.button, styles.primaryButton]}
//                 onPress={handleNext}>
//                 <Text style={styles.primaryText}>
//                   {isLast ? 'Get Started' : 'Next'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default BottomAlert;

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: '#4169E1',
//   },
//   alertBox: {
//     width,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     overflow: 'hidden',
//   },
//   topContainer: {
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingTop: 30,
//     borderTopEndRadius: 20,
//     borderTopStartRadius: 20,
//   },
//   image: {
//     width: '70%',
//     height: 180,
//   },
//   bottomContainer: {
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111B47',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   highlight: {
//     color: '#377DFF',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   indicatorContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   indicator: {
//     width: 20,
//     height: 6,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   activeIndicator: {
//     backgroundColor: '#377DFF',
//   },
//   inactiveIndicator: {
//     backgroundColor: '#E5E7EB',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 10,
//   },
//   cancelButton: {
//     backgroundColor: '#E5E7EB',
//   },
//   primaryButton: {
//     backgroundColor: '#377DFF',
//   },
//   cancelText: {
//     color: '#111B47',
//     fontWeight: '600',
//   },
//   primaryText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

interface BottomAlertProps {
  visible: boolean;
  title: string;
  subtitle: string;
  imageUrl?: string;
  primaryText?: string;
  onPrimaryPress?: () => void;
  onCancel?: () => void;
}

const BottomAlert: React.FC<BottomAlertProps> = ({
  visible,
  title,
  subtitle,
  imageUrl,
  primaryText = 'Get Started',
  onPrimaryPress,
  onCancel,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.topContainer}>
          <Image
            source={require('../assets/images/home_page_alert.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.alertBox}>
          {/* Top section with image */}

          {/* Bottom section */}
          <View style={styles.bottomContainer}>
            <Text style={styles.title}>
              {title.split(' ').map((word, i) => {
                if (word.toLowerCase() === 'friends') {
                  return (
                    <Text key={i} style={styles.highlight}>
                      {word + ' '}
                    </Text>
                  );
                }
                return word + ' ';
              })}
            </Text>

            <Text style={styles.subtitle}>{subtitle}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onPrimaryPress}>
                <Text style={styles.primaryText}>{primaryText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BottomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0.5)',
    backgroundColor: '#4169E1',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  alertBox: {
    width,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  topContainer: {
    backgroundColor: '#4169E1',
    alignItems: 'center',
    paddingTop: 30,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  image: {
    width: '70%',
    height: 180,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111B47',
    textAlign: 'center',
    marginTop: 10,
  },
  highlight: {
    color: '#377DFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
  },
  primaryButton: {
    backgroundColor: '#377DFF',
  },
  cancelText: {
    color: '#111B47',
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '600',
  },
});
