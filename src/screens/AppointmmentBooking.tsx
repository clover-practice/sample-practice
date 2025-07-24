import React from 'react';
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
} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import Constants from '../constants/Constants';
import responsive from '../utils/responsive';
import colors from '../constants/colors';
import {getFormattedDate} from '../utils/getFormattedDate';
import HorizontalCalendar from '../components/HorizontalCalendar';

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
  const renderItem = ({item}: {item: ServiceItem}) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => console.log(`Selected: ${item.title}`)}>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={colors.STATUS_BAR_COLOR}
        barStyle="dark-content"
      />

      <CustomHeader
        title="Ayala Heights"
        showBack={true}
        showShare={true}
        onBackPress={() => goBack()}
        rightIconName="sync-outline" // from Ionicons
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{flex: 1, justifyContent: 'center'}}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AppointmmentBooking;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  scrollContainer: {
    padding: responsive.padding(Constants.SCREEN_PADDING),
    paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
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
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
