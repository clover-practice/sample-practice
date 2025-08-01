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
  const [modalVisible, setModalVisible] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'billing' | 'payment'>(
    'billing',
  );

  return (
    <View style={styles.safeArea}>
      <CustomHeader title="My Wallet" showBack={true} onBackPress={goBack} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          {/* Top Loyalty Card with Gradient */}
          <LinearGradient
            colors={['#0072ff', '#00c6ff']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientCard}>
            <View style={styles.cardContent}>
              <View style={styles.pointsInfo}>
                <Text style={styles.pointsText}>300</Text>
                <Text style={styles.labelText}>Loyalty Points</Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.claimButton}>
                <Text style={styles.claimButtonText}>Claim Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Bottom Actions */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={() => console.log('CLICKED ON Buy gift card')}
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
              onPress={() => console.log('CLICKED ON Claim gift card')}
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

        {/* Tabs */}
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
    </View>
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
    borderRadius: responsive.borderRadius(10),
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: responsive.padding(20),
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    marginRight: 10,
  },
  labelText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
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
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  tabTextSelected: {
    color: '#000',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
    backgroundColor: '#0072ff',
    borderRadius: 2,
  },
  tabContent: {
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
