import React, {useState} from 'react';

import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import Constants from '../constants/Constants';
import responsive from '../utils/responsive';
import colors from '../constants/colors';
import {getFormattedDate} from '../utils/getFormattedDate';
import HorizontalCalendar from '../components/HorizontalCalendar';
import Colors from '../constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';
import TermsPrivacyText from '../components/TermsPrivacyText';

const data = [
  {id: '1', title: '05:30 PM'},
  {id: '2', title: '06:30 PM'},
  {id: '3', title: '07:30 PM'},
  {id: '4', title: '05:45 PM'},
  {id: '5', title: '06:45 PM'},
  {id: '6', title: '07:45 PM'},
  {id: '7', title: '06:00 PM'},
  {id: '8', title: '07:00 PM'},
  {id: '9', title: '08:00 PM'},
  {id: '10', title: '06:15 PM'},
  {id: '11', title: '07:15 PM'},
  {id: '12', title: '08:15 PM'},
];

const numColumns = 3;
const gridSpacing = 16;
const screenWidth = Dimensions.get('window').width;

const AppointmmentBooking = () => {
  type ServiceItem = {
    id: string;
    title: string;
  };
  // const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<ServiceItem['id'] | null>(null);

  const renderItem = ({item}: {item: ServiceItem}) => {
    const isSelected = selectedId === item.id;

    return (
      <TouchableOpacity
        style={[styles.gridItem, isSelected && styles.selected]}
        onPress={() => {
          console.log(`Selected: ${item.title}`);
          setSelectedId(item.id);
          console.log(`Selected: ${item.id}`);
        }}>
        <Text style={[styles.title, isSelected && styles.titleSelected]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader
          title="Ayala Heights"
          showBack={true}
          showShare={true}
          onBackPress={() => goBack()}
          rightIconName="sync-outline" // from Ionicons
        />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.scrollMainView}>
              {/* ==================HORIZONTAL CALENDER======================= */}
              <HorizontalCalendar />

              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={numColumns}
                contentContainerStyle={styles.gridContainer}
                scrollEnabled={false} // disable inside ScrollView
              />
            </View>
            {/* Offer Details */}
            <View style={styles.inputBoxMain}>
              <View style={styles.leftContent}>
                <Ionicons name="pricetag" size={14} color="#0f0" />
                <Text style={styles.inputText}> Choose Offer</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24} color="#000" />
            </View>

            {/* Bill Details Section */}
            <View style={styles.card}>
              <Text style={styles.titleBill}>Bill Details</Text>
              <View style={styles.subInfoRow}>
                <View style={styles.row}>
                  <Text style={styles.subTitle}>Your Services</Text>
                  <Ionicons
                    name="chevron-up-circle"
                    size={16}
                    color="#888"
                    style={{marginLeft: 4}}
                  />
                </View>
                <Text style={styles.price}>₹ 1,416</Text>
              </View>

              <View style={styles.serviceRow}>
                <View style={styles.iconContainer}>
                  <Ionicons name="woman-outline" size={28} color="#ec5b92" />
                  <Text style={styles.genderLabel}>Women</Text>
                </View>

                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceSubtitle}>
                    Hair-Cut, Wash & Style | Haircut
                  </Text>
                  <View style={styles.divider} />
                  <Text style={styles.serviceTitle}>Haircut</Text>
                </View>

                <TouchableOpacity style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              title="Book & Pay after Service"
              onPress={() => console.log()}
              style={styles.button}
            />
          </View>
        </ScrollView>
        <TermsPrivacyText
          prefixText="By booking an appointment, you agree to our"
          termsLabel="Terms of Services"
          privacyLabel=" Privacy Policy "
          textColor={colors.GRAY}
          linkColor={colors.GRAY}
          onPressTerms={() => console.log('Terms Pressed')}
          onPressPrivacy={() => console.log('Privacy Pressed')}
        />
      </View>
    </View>
  );
};

export default AppointmmentBooking;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContainer: {
    padding: responsive.padding(Constants.SCREEN_PADDING),
    paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
  },
  scrollMainView: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.WHITE,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: responsive.margin(10),
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: responsive.padding(6),
    padding: 5,
    backgroundColor: '#fff',
    borderColor: colors.GRAY,
    borderWidth: 1,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  gridContainer: {
    paddingVertical: 8,
  },
  gridItem: {
    width: (screenWidth - gridSpacing * (numColumns + 1)) / numColumns,
    margin: gridSpacing / 4,
    backgroundColor: colors.WHITE,
    borderRadius: 8,
    paddingVertical: 4,
    borderColor: colors.GRAY,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  titleSelected: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.WHITE,
  },
  inputBoxMain: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // key change
  },

  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    elevation: 4,
    marginTop: 10,
  },
  titleBill: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  subInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 5,
    marginBottom: 5,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  genderLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  removeBtn: {
    paddingLeft: 8,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    width: '100%',
  },
  selected: {
    backgroundColor: colors.PRIMARY, // your selected color
  },
});
