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
import {goBack} from '../utils/NavigationUtils';

const EditProfileScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f8f9fb" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons
              name="chevron-back-outline"
              size={responsive.fontSize(26)}
              color="#111"
            />
          </TouchableOpacity>
          <Text style={styles.title}>My Account</Text>
          <TouchableOpacity>
            <Ionicons
              name="notifications-outline"
              size={responsive.fontSize(22)}
              color="#111"
            />
          </TouchableOpacity>
        </View>

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
          <View style={styles.pointsBanner}>
            <Text style={styles.pointsText}>
              Awesome. You have received <Text style={styles.bold}>25</Text>{' '}
              points.
            </Text>
          </View>
        </View>

        {/* Sections */}
        <Section title="My Appointments" icon="calendar-today" />
        <Section title="My Wallet" icon="account-balance-wallet" />

        {/* Gift Card Section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Gift Card</Text>
          <Section title="Buy Gift Card" icon="card-giftcard" />
          <Section title="Claim Gift Card" icon="redeem" />
          <Section title="Purchase History" icon="history" />
        </View>

        {/* Spread the love Section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionTitle}>Spread the love</Text>
          <Section title="Invite Friends & Family" icon="group" />
          <Section title="Share App" icon="share" />
          <Section title="Your Favourite Places" icon="favorite-border" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Section = ({title, icon}: {title: string; icon: string}) => (
  <TouchableOpacity style={styles.sectionRow}>
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
    backgroundColor: '#f8f9fb',
  },
  scrollContainer: {
    padding: responsive.padding(16),
    paddingBottom: responsive.padding(30),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsive.margin(10),
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
    backgroundColor: '#0e84ff',
    padding: responsive.padding(10),
    borderBottomEndRadius: responsive.borderRadius(8),
    borderBottomLeftRadius: responsive.borderRadius(8),
    marginTop: responsive.margin(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    color: '#fff',
    fontSize: responsive.fontSize(13),
  },
  bold: {
    fontWeight: '700',
  },
  sectionGroup: {
    marginTop: responsive.margin(20),
    marginBottom: responsive.margin(5),
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: responsive.fontSize(15),
    marginBottom: responsive.margin(5),
    color: '#555',
  },
  sectionRow: {
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
});

export default EditProfileScreen;
