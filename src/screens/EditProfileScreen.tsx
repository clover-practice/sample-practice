import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import responsive from '../utils/responsive';
import {goBack, navigate} from '../utils/NavigationUtils';
import Colors from '../constants/colors';
import CustomHeader from '../components/CustomHeader';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../constants/Constants';

const EditProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={Colors.STATUS_BAR_COLOR}
        barStyle="dark-content"
      />

      <CustomHeader
        title="My Account"
        showBack={true}
        showShare={true}
        onBackPress={() => goBack()}
        rightIconName="notifications-outline" // from Ionicons
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.username}>ROHIT</Text>
              <Text style={styles.mobile}>8452046123</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.edit}>EDIT</Text>
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={['#0072ff', '#00c6ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientCard}>
            <View style={styles.pointsBanner}>
              <Text style={styles.pointsText}>
                Awesome. You have received <Text style={styles.bold}>25</Text>{' '}
                points.
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Sections */}
        <Section
          title="My Appointments"
          icon="calendar-today"
          onPress={() => navigate('MyAppointmentBooking')}
        />
        <Section
          title="My Wallet"
          icon="account-balance-wallet"
          onPress={() => navigate('MyWalletScreen')}
        />

        {/* Gift Card Section */}
        <Text style={styles.sectionTitle}>Gift Card</Text>
        <View style={styles.sectionGroup}>
          <Section
            title="Buy Gift Card"
            icon="card-giftcard"
            onPress={() => console.log('Buy Gift Card')}
          />
          <View style={styles.sectionDevider}></View>
          <Section
            title="Claim Gift Card"
            icon="redeem"
            onPress={() => console.log('Claim Gift Card')}
          />
          <View style={styles.sectionDevider}></View>
          <Section
            title="Purchase History"
            icon="history"
            onPress={() => console.log('Purchase History')}
          />
        </View>

        {/* Spread the love Section */}
        <Text style={styles.sectionTitle}>Spread the love</Text>
        <View style={styles.sectionGroup}>
          <Section
            title="Invite Friends & Family"
            icon="group"
            onPress={() => console.log('Invite Friends & Family')}
          />
          <View style={styles.sectionDevider}></View>
          <Section
            title="Share App"
            icon="share"
            onPress={() => console.log('Share App')}
          />
          <View style={styles.sectionDevider}></View>
          <Section
            title="Your Favourite Places"
            icon="favorite-border"
            onPress={() => console.log('Your Favourite Places')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section: React.FC<{
  title: string;
  icon: string;
  onPress: () => void;
}> = ({title, icon, onPress}) => (
  <TouchableOpacity style={styles.sectionRow} onPress={onPress}>
    <MaterialIcons name={icon} size={responsive.fontSize(20)} color="#555" />
    <Text style={styles.sectionText}>{title}</Text>
    <Ionicons
      name="chevron-forward"
      size={responsive.fontSize(18)}
      color="#aaa"
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContainer: {
    padding: responsive.padding(Constants.SCREEN_PADDING),
    paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
    backgroundColor: Colors.STATUS_BAR_COLOR,
  },
  title: {
    fontSize: responsive.fontSize(20),
    fontWeight: '600',
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    paddingTop: responsive.padding(15),
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(15),
    // Add shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation (Android)
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsive.margin(10),
    paddingLeft: 10,
    paddingEnd: 10,
  },
  gradientCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: responsive.borderRadius(10),
    borderBottomRightRadius: responsive.borderRadius(10),
  },
  username: {
    fontSize: responsive.fontSize(16),
    fontWeight: '700',
    color: '#111',
  },
  mobile: {
    color: '#888',
    fontSize: responsive.fontSize(13),
  },
  edit: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: responsive.fontSize(14),
  },

  pointsBanner: {
    padding: responsive.padding(10),
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: responsive.borderRadius(8),
    borderBottomLeftRadius: responsive.borderRadius(8),
    marginTop: responsive.margin(8),
  },

  pointsText: {
    color: '#fff',
    fontSize: responsive.fontSize(13),
  },
  bold: {
    fontWeight: '700',
  },
  sectionGroup: {
    marginTop: responsive.margin(10),
    marginBottom: responsive.margin(5),
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    // Add shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation (Android)
    elevation: 0.5,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: responsive.fontSize(15),
    marginTop: responsive.margin(5),
    color: '#555',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsive.padding(12),
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(10),
  },
  sectionRowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: responsive.padding(12),
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(10),
    // Add shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation (Android)
    elevation: 0.5,
  },

  sectionText: {
    flex: 1,
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(14),
    color: '#111',
  },

  sectionDevider: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f8f9fb',
    height: 2,
  },
  gradientLayerContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: -1,
  },

  gradientStep: {
    flex: 1,
    width: '100%',
  },
});

export default EditProfileScreen;
