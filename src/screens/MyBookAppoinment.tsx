import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import responsive from '../utils/responsive';
import Constants from '../constants/Constants';
import Colors from '../constants/colors';
import ServiceCard from '../components/ServiceCard';
import customFunctions from '../utils/CustomFunction';

// ✅ 1. Define tab key type
type TabKey = 'Confirmation' | 'Today' | 'Upcoming';

// ✅ 2. Define appointment item type
type AppointmentItem = {
  id: string;
  title: string;
  icon: any;
  unpaidAmount: number;
  date: string;
  time: string;
};
const currentDate = customFunctions.getFormattedDateTime();
const currentDatePlus5 = customFunctions.getFutureDateTimePlus5();
const currentDateMinus5 = customFunctions.getPastDateTimeMinus5();

// ✅ 3. Define appointment data with correct types
const appointmentData: Record<TabKey, AppointmentItem[]> = {
  Confirmation: [
    {
      id: '1',
      title: 'Haircut',
      icon: require('../assets/images/user.jpg'),
      unpaidAmount: 1200,
      date: currentDateMinus5,
      time: '06:45 PM',
    },
    {
      id: '2',
      title: 'Haircut',
      icon: require('../assets/images/user.jpg'),
      unpaidAmount: 1200,
      date: currentDateMinus5,
      time: '06:45 PM',
    },
  ],
  Today: [
    {
      id: '1',
      title: 'Beard Trim',
      icon: require('../assets/images/user.jpg'),
      unpaidAmount: 800,
      date: currentDate,
      time: '03:30 PM',
    },
    {
      id: '2',
      title: 'Beard Trim',
      icon: require('../assets/images/user.jpg'),
      unpaidAmount: 800,
      date: currentDate,
      time: '03:30 PM',
    },
  ],
  Upcoming: [
    {
      id: '1',
      title: 'Facial',
      icon: require('../assets/images/user.jpg'),
      unpaidAmount: 1500,
      date: currentDatePlus5,
      time: '11:00 AM',
    },
    {
      id: '1',
      title: 'Facial',
      icon: require('../assets/images/user.jpg'),
      unpaidAmount: 1500,
      date: currentDatePlus5,
      time: '11:00 AM',
    },
  ],
};

const MyBookAppoinment = () => {
  // ✅ 4. Use correct state types
  const [selectedButton, setSelectedButton] = useState<TabKey>('Today');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTogglePress = () => {
    setIsExpanded(prev => !prev);
  };

  const renderTabButton = (label: TabKey) => (
    <TouchableOpacity key={label} onPress={() => setSelectedButton(label)}>
      <View
        style={[
          styles.offerButton,
          selectedButton === label && styles.selectedButton,
        ]}>
        <Text
          style={[
            styles.offerText,
            selectedButton === label && styles.selectedText,
          ]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <CustomHeader
        title={Constants.My_Appointments}
        showBack={true}
        onBackPress={() => goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonView}>
            {(['Confirmation', 'Today', 'Upcoming'] as TabKey[]).map(
              renderTabButton,
            )}
          </ScrollView>

          {/* Service cards by selected tab */}
          {appointmentData[selectedButton]?.map((item, index) => (
            <ServiceCard
              key={index}
              title={item.title}
              icon={item.icon}
              unpaidAmount={item.unpaidAmount}
              datetime={item.date}
              onPayPress={() => console.log('Pay', item.id)}
              onAddServicePress={() => console.log('Add Service', item.title)}
              onTogglePress={handleTogglePress}
              isExpanded={isExpanded}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MyBookAppoinment;

// ✅ 5. Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContainer: {
    paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  buttonView: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: 'white',
  },
  selectedButton: {
    backgroundColor: 'dodgerblue',
    borderColor: 'dodgerblue',
  },
  offerText: {
    color: '#555',
    fontSize: responsive.fontSize(13),
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import CustomHeader from '../components/CustomHeader';
// import {goBack} from '../utils/NavigationUtils';
// import responsive from '../utils/responsive';
// import Constants from '../constants/Constants';
// import Colors from '../constants/colors';
// import ServiceCard from '../components/ServiceCard';

// const MyBookAppoinment = () => {
//   const [selectedButton, setSelectedButton] = useState('');
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleTogglePress = () => {
//     setIsExpanded(prev => !prev);
//   };

//   return (
//     <View style={styles.safeArea}>
//       <CustomHeader
//         title={Constants.My_Appointments}
//         showBack={true}
//         onBackPress={() => goBack()}
//       />

//       <ScrollView
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}>
//         {/* Main red container */}
//         <View style={styles.container}>
//           {/* Horizontal Scrollable Buttons */}
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.buttonView}>
//             <TouchableOpacity onPress={() => console.log('Confirmation')}>
//               <View style={styles.offerButton}>
//                 <Text style={styles.offerText}>Confirmation</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => console.log('Today')}>
//               <View style={styles.offerButton}>
//                 <Text style={styles.offerText}>Today</Text>
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => console.log('Upcoming')}>
//               <View style={styles.offerButton}>
//                 <Text style={styles.offerText}>Upcoming</Text>
//               </View>
//             </TouchableOpacity>
//           </ScrollView>

//           {/* Service Cards */}
//           <ServiceCard
//             title="Haircut"
//             icon={require('../assets/images/user.jpg')}
//             unpaidAmount={1200}
//             date="22 Apr ,2025"
//             time="06:45 PM"
//             onPayPress={() => console.log('Pay')}
//             onAddServicePress={() => console.log('Add Service')}
//             onTogglePress={() => handleTogglePress()}
//             isExpanded={isExpanded}
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default MyBookAppoinment;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: Colors.BACKGROUND,
//   },
//   scrollContainer: {
//     paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
//   },
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//   },
//   buttonView: {
//     flexDirection: 'row',
//     paddingHorizontal: 12,
//     paddingTop: 16,
//     paddingBottom: 8,
//   },
//   offerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'dodgerblue',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     marginRight: 10,
//   },
//   offerText: {
//     color: '#555',
//     fontSize: responsive.fontSize(13),
//     fontWeight: '500',
//   },
// });
