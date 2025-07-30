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

const MyBookAppoinment = () => {
  const [selectedButton, setSelectedButton] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTogglePress = () => {
    setIsExpanded(prev => !prev);
  };

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
        {/* Main red container */}
        <View style={styles.container}>
          {/* Horizontal Scrollable Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonView}>
            <TouchableOpacity onPress={() => console.log('Confirmation')}>
              <View style={styles.offerButton}>
                <Text style={styles.offerText}>Confirmation</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log('Today')}>
              <View style={styles.offerButton}>
                <Text style={styles.offerText}>Today</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log('Upcoming')}>
              <View style={styles.offerButton}>
                <Text style={styles.offerText}>Upcoming</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Service Cards */}
          <ServiceCard
            title="Haircut"
            icon={require('../assets/images/user.jpg')}
            unpaidAmount={1200}
            date="22 Apr ,2025"
            time="06:45 PM"
            onPayPress={() => console.log('Pay')}
            onAddServicePress={() => console.log('Add Service')}
            onTogglePress={() => handleTogglePress()}
            isExpanded={isExpanded}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MyBookAppoinment;

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
  },
  offerText: {
    color: '#555',
    fontSize: responsive.fontSize(13),
    fontWeight: '500',
  },
});
