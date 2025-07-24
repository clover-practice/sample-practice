import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import HeaderImageCarousel from '../components/HeaderImageCarouselDetails';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';

const {width} = Dimensions.get('window');

const TABS = ['Services', 'Photos', 'About', 'Reviews'];

const SERVICES = [
  {
    label: 'Hair-Cut, Wash & Style',
    image: require('../assets/images/user.jpg'),
  },
  {label: 'Hair Colour', image: require('../assets/images/banner.png')},
  {label: 'Nail Bar', image: require('../assets/images/banner.png')},
  {label: 'Face', image: require('../assets/images/user.jpg')},
  {label: 'Massage & Spa', image: require('../assets/images/banner.png')},
  {label: "Men's Grooming", image: require('../assets/images/banner.png')},
];

const PHOTOS = [
  {label: 'All Photos (3)', image: require('../assets/images/banner.png')},
  {label: 'Ambience (3)', image: require('../assets/images/banner.png')},
];

const HEADER_IMAGES = [
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
];

export default function SalonDetailScreen() {
  const [activeTab, setActiveTab] = useState('Services');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Services':
        return (
          <View style={styles.gridContainer}>
            {SERVICES.map((item, index) => (
              <View style={styles.gridItem} key={index}>
                <Image source={item.image} style={styles.gridImage} />
                <Text style={styles.gridText}>{item.label}</Text>
              </View>
            ))}
          </View>
        );
      case 'Photos':
        return (
          <View style={styles.photoContainer}>
            {PHOTOS.map((item, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={item.image} style={styles.photoImage} />
                <Text style={styles.photoText}>{item.label}</Text>
              </View>
            ))}
          </View>
        );
      case 'About':
        return (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutHeading}>About</Text>
            <Text style={styles.aboutText}>
              Established in 1989, Bruno’s Barbers has grown to a large network
              of branches nationwide. With its stylish, modern interiors, and
              commitment to providing excellent customer service, it has become
              the go-to place for men’s grooming in the Philippines.
            </Text>
            <Text style={styles.aboutHeading}>Amenities</Text>
          </View>
        );
      case 'Reviews':
        return (
          <Text style={styles.aboutText}>Customer Reviews will be here.</Text>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <CustomHeader
            title={'AlayaHeight'}
            showBack={true}
            onBackPress={goBack}
          />

          {/* ==========Header Image Carousel================ */}

          <HeaderImageCarousel images={HEADER_IMAGES} duration={5000} />
          {/* Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.salonName}>Ayala Heights</Text>
            <Text style={styles.address}>Ayala Heights, Quezon City</Text>
            <Text style={styles.subText}>Unisex · ₹₹</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.openText}>🟢 Open now</Text>
              <Text style={styles.timeText}>10:00 AM - 09:00 PM</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text>📍 Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text>📞 Contact</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>🎉 Get 40% OFF</Text>
              <Text>25% Discount + 15% Cashback</Text>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {TABS.map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {renderTabContent()}
        </ScrollView>

        {/* Sticky Bottom Buttons */}
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineText}>Book services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filledButton}>
            <Text style={styles.filledText}>Pay bill</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  salonName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#555',
  },
  subText: {
    color: '#777',
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  openText: {
    color: 'green',
  },
  timeText: {
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  secondaryButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  offerCard: {
    backgroundColor: '#e9f4ff',
    padding: 12,
    borderRadius: 12,
  },
  offerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  gridItem: {
    width: width / 4.5,
    alignItems: 'center',
    marginVertical: 10,
  },
  gridImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  gridText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  photoContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  photoItem: {
    alignItems: 'center',
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  photoText: {
    marginTop: 4,
  },
  aboutContainer: {
    padding: 16,
  },
  aboutHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
  },
  aboutText: {
    marginTop: 4,
    color: '#444',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  outlineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00aaff',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 6,
    alignItems: 'center',
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#00aaff',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 6,
    alignItems: 'center',
  },
  outlineText: {
    color: '#00aaff',
    fontWeight: 'bold',
  },
  filledText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
