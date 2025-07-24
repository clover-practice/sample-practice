import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import responsive from '../utils/responsive';
import Constants from '../constants/Constants';
import Colors from '../constants/colors'; // Assuming you have this instead of importing from 'react-native'

const MyBookAppoinment = () => {
  const [selectedButton, setSelectedButton] = useState('');
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={Colors.STATUS_BAR_COLOR}
        barStyle="dark-content"
      />

      <ScrollView style={styles.scrollContainer}>
        <CustomHeader
          title={Constants.My_Appointments}
          showBack={true}
          onBackPress={() => goBack()}
        />

        {/*======================================== Horizontal Scrollable Buttons======================================== */}
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
        {/*======================================== Rest remaining content goes here ======================================== */}
        <View>
          <Text style={styles.offerText}>Upcoming</Text>
          <Text style={styles.offerText}>Upcoming</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
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
