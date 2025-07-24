import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import responsive from '../utils/responsive';
import {goBack, navigate} from '../utils/NavigationUtils';
import Colors from '../constants/colors';
import CustomHeader from '../components/CustomHeader';
import LinearGradient from 'react-native-linear-gradient';
import Constants from '../constants/Constants';
import CustomButton from '../components/CustomButton';
import {clearAll, getValue, setValue} from '../utils/keychainStorage';

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
        rightIconName="notifications-outline"
      />

      {/* Main Content with Scrollable + Fixed Footer */}
      <View style={styles.container}>
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
            onPress={() => navigate('MyBookAppoinment')}
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

        <View style={styles.logoutButton}>
          <CustomButton
            title="Logout"
            style={styles.logoutBtnStyle}
            textStyle={styles.logoutText}
            rightIcon={<Ionicons name="log-out" size={20} color="white" />}
            onPress={async () => {
              await clearAll();
              navigate('Login');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default EditProfileScreen;

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
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: responsive.padding(Constants.SCREEN_PADDING),
    paddingBottom: responsive.padding(80), // Give extra space above logout
  },
  card: {
    backgroundColor: '#fff',
    paddingTop: responsive.padding(15),
    borderRadius: responsive.borderRadius(10),
    marginBottom: responsive.margin(15),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.5},
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  sectionText: {
    flex: 1,
    marginLeft: responsive.margin(10),
    fontSize: responsive.fontSize(14),
    color: '#111',
  },
  sectionDevider: {
    width: '100%',
    backgroundColor: '#f8f9fb',
    height: 2,
  },

  logoutButton: {
    paddingVertical: responsive.padding(50),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },

  logoutBtnStyle: {
    alignSelf: 'center',
    backgroundColor: '#d00',
    paddingVertical: responsive.padding(10),
    paddingHorizontal: responsive.padding(25),
  },
  logoutText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#fff',
  },
});
