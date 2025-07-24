import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import Colors from '../constants/colors';
import responsive from '../utils/responsive';
import Constants from '../constants/Constants';

const MyWalletScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'billing' | 'payment'>(
    'billing',
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={Colors.STATUS_BAR_COLOR}
        barStyle="dark-content"
      />
      <CustomHeader title="My Wallet" showBack={true} onBackPress={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/*========================================== Top Loyalty Card with Gradient  ==========================================*/}
          <LinearGradient
            colors={['#0072ff', '#00c6ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientCard}>
            <View style={styles.cardContent}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>300</Text>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>Loyalty Points</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.claimButton}>
              <Text style={styles.claimButtonText}>Claim Now</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Bottom Actions */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={() => console.log('CLICKED ON  Buy gift card')}
              style={styles.actionItem}>
              <Text style={styles.actionText}>Buy gift card</Text>
              <Ionicons
                name="chevron-forward"
                size={responsive.fontSize(14)}
                color="#444"
              />
            </TouchableOpacity>

            <Text style={styles.verticalDivider}>|</Text>

            <TouchableOpacity
              onPress={() => console.log('CLICKED ON  Claim gift card')}
              style={styles.actionItem}>
              <Text style={styles.actionText}>Claim gift card</Text>
              <Ionicons
                name="chevron-forward"
                size={responsive.fontSize(14)}
                color="#444"
              />
            </TouchableOpacity>
          </View>
        </View>
        {/*========================================== Tabs ==========================================*/}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedTab('billing')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'billing' && styles.tabTextSelected,
              ]}>
              Billing History
            </Text>
            {selectedTab === 'billing' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setSelectedTab('payment')}>
            <Text
              style={[
                styles.tabText,
                selectedTab === 'payment' && styles.tabTextSelected,
              ]}>
              Payment Details
            </Text>
            {selectedTab === 'payment' && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {selectedTab === 'billing' ? (
            <Text style={{color: '#888'}}>No billing history yet.</Text>
          ) : (
            <Text style={{color: '#888'}}>No payment details available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyWalletScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContainer: {
    padding: responsive.padding(Constants.SCREEN_PADDING),
    paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap', // wraps to new line if needed
    gap: 8,
    padding: responsive.padding(20),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: responsive.borderRadius(10),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  gradientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: responsive.borderRadius(10),
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: 6,
  },
  pointsText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    marginRight: 10,
  },
  labelContainer: {
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    flexShrink: 1, // Prevent overflow
    maxWidth: responsive.width(55), // Avoid pushing the button
  },
  claimButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginEnd: responsive.margin(20),
  },
  claimButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0072ff',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: responsive.padding(14),
    backgroundColor: '#fff',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: responsive.fontSize(13),
    fontWeight: '500',
    color: '#222',
  },
  verticalDivider: {
    fontSize: 16,
    color: '#bbb',
    paddingHorizontal: 10,
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: responsive.margin(10),
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabItemSelected: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  tabTextSelected: {
    color: '#000',
  },
  tabContent: {
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
    backgroundColor: '#0072ff',
    borderRadius: 2,
  },
});
