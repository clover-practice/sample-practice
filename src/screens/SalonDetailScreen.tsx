import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';

import HeaderImageCarousel from '../components/HeaderImageCarouselDetails';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import Strings from '../constants/Constants';
import CircularArcLoader from '../components/spinner/CircularLoaderView';
import TailSpinnerLoader from '../components/spinner/ TailSpinnerLoader';

const {width} = Dimensions.get('window');

// Define the Review interface based on Google Places API response structure
interface Review {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  profile_photo_url?: string;
}

// Define the Photo interface for API response
interface Photo {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

// Define the PlaceItem interface as it's passed as a parameter
interface PlaceItem {
  id: string; // This is the place_id
  title: string;
  description: string;
  address: string;
  coordinate: {latitude: number; longitude: number};
  rating: number | null;
  isOpen: boolean | null;
  iconUrl: string | null;
  distanceKm: string;
  openingHoursText: string | null; // This still comes from MapAndListView for initial display, but will be overridden
}

// Define the RootStackParamList for type safety with navigation
type RootStackParamList = {
  SalonDetailScreen: PlaceItem;
  MapAndListView: undefined;
};

// Define the type for the route params specifically for SalonDetailScreen
type SalonDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'SalonDetailScreen'
>;

const TABS = ['Services', 'Photos', 'About', 'Reviews'];

const SERVICES = [
  {
    id: '1',
    title: 'Hair-cut,Wash & Style',
    image: require('../assets/images/services_img/hair_cut_wash.png'),
  },
  {
    id: '2',
    title: 'Hair Color',
    image: require('../assets/images/services_img/hair_color.png'),
  },
  {
    id: '3',
    title: 'Nail Bar',
    image: require('../assets/images/services_img/nail_bar.png'),
  },
  {
    id: '4',
    title: 'Face',
    image: require('../assets/images/services_img/face.png'),
  },
  {
    id: '5',
    title: 'Massage & Spa',
    image: require('../assets/images/services_img/massage_spa.png'),
  },
  {
    id: '6',
    title: `Men's Groming`,
    image: require('../assets/images/services_img/mens_grooming.png'),
  },
  {
    id: '7',
    title: 'Waxing,Bleaching & Threading',
    image: require('../assets/images/services_img/waxing_thread.png'),
  },
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
  const [loading, setLoading] = useState(false);
  const route = useRoute<SalonDetailScreenRouteProp>();
  const {
    id,
    title,
    address,
    description,
    rating,
    isOpen,
    iconUrl,
    distanceKm,
    openingHoursText,
    coordinate,
  } = route.params;

  // States for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // State for amenities
  const [amenities, setAmenities] = useState<string[]>([]);

  // State for full opening hours fetched by this screen
  const [fetchedFullOpeningHours, setFetchedFullOpeningHours] = useState<
    string[] | null
  >(null);

  // New state for today's hours to be displayed on the main screen
  const [displayTodayHours, setDisplayTodayHours] = useState<string | null>(
    openingHoursText,
  );

  // State for hours modal
  const [isHoursModalVisible, setIsHoursModalVisible] = useState(false);

  // New state for phone number
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // New states for call unsupported modal
  const [isCallNotSupportedModalVisible, setIsCallNotSupportedModalVisible] =
    useState(false);
  const [callNotSupportedMessage, setCallNotSupportedMessage] = useState('');

  // New states for map unsupported modal
  const [isMapNotSupportedModalVisible, setIsMapNotSupportedModalVisible] =
    useState(false);
  const [mapNotSupportedMessage, setMapNotSupportedMessage] = useState('');

  // New state for fetched photos
  const [fetchedPhotos, setFetchedPhotos] = useState<Photo[]>([]);

  // Effect to fetch place details (including reviews, amenities, and full hours)
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!id) {
        setDetailsError('Salon ID not available to fetch details.');
        setLoadingDetails(false);
        return;
      }
      setLoading(true);
      setLoadingDetails(true);
      setDetailsError(null);
      setReviews([]);
      setAmenities([]);
      setFetchedFullOpeningHours(null);
      setDisplayTodayHours(null);
      setPhoneNumber(null); // Reset phone number
      setFetchedPhotos([]); // Reset photos

      try {
        const apiUrl = `${Strings.PLACE_IMAGE_URL}${id}&key=${Strings.GOMAPS_API_KEY}`;

        console.log('Fetching place details:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();
        setLoading(false);
        console.log(
          'API Response (pretty JSON): All Places ',
          JSON.stringify(data, null, 2),
        );

        if (data.status === 'OK' && data.result) {
          // Process Reviews
          if (data.result.reviews) {
            setReviews(data.result.reviews);
          }

          // Process Amenities
          const fetchedAmenities: string[] = [];
          const result = data.result;

          if (result.wheelchair_accessible_entrance)
            fetchedAmenities.push('Wheelchair Accessible Entrance');
          if (result.restroom) fetchedAmenities.push('Restroom Available');
          if (result.outdoor_seating) fetchedAmenities.push('Outdoor Seating');
          if (result.parking) fetchedAmenities.push('Parking Available');
          if (result.reservable)
            fetchedAmenities.push('Reservations Available');
          if (result.curbside_pickup) fetchedAmenities.push('Curbside Pickup');
          if (result.delivery) fetchedAmenities.push('Delivery');
          if (result.takeout) fetchedAmenities.push('Takeout');

          setAmenities(fetchedAmenities);

          // Process Full Opening Hours (weekday_text)
          if (data.result.opening_hours?.weekday_text) {
            const fullHours = data.result.opening_hours.weekday_text;
            setFetchedFullOpeningHours(fullHours);

            // Calculate and set today's hours for main display
            const currentDayIndex = (new Date().getDay() + 6) % 7; // Adjust for Monday=0, Sunday=6
            const todayEntry = fullHours[currentDayIndex];
            if (todayEntry) {
              // Extract just the time part (e.g., "10:00 am – 9:00 pm" from "Monday: 10:00 am – 9:00 pm")
              const extractedTime = todayEntry.split(': ').slice(1).join(': ');
              setDisplayTodayHours(extractedTime);
            } else {
              setDisplayTodayHours('Hours not available');
            }
          } else {
            setFetchedFullOpeningHours(null);
            setDisplayTodayHours('Hours not available');
          }

          // Process Phone Number
          if (result.international_phone_number) {
            setPhoneNumber(result.international_phone_number);
          } else if (result.formatted_phone_number) {
            setPhoneNumber(result.formatted_phone_number);
          }

          // Process Photos
          if (data.result.photos) {
            setFetchedPhotos(data.result.photos);
          }
        } else if (data.status === 'ZERO_RESULTS') {
          setDetailsError('No details found for this place.');
          setDisplayTodayHours('Hours not available');
        } else {
          setDetailsError(
            data.error_message || 'Failed to fetch place details.',
          );
          setDisplayTodayHours('Hours not available');
        }
      } catch (error: any) {
        setLoading(false);
        console.error('Error fetching place details:', error);
        setDetailsError(
          `Failed to load details: ${error.message || 'Unknown error'}`,
        );
        setDisplayTodayHours('Hours not available');
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchPlaceDetails();
  }, [id]);

  const currentDayIndexForModal = (new Date().getDay() + 6) % 7;

  // Function to handle making a call
  const handleCall = () => {
    if (phoneNumber) {
      // Use 'tel:' scheme for phone calls
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            // Fallback for simulators or devices that don't support direct calls
            setCallNotSupportedMessage(
              `Phone call not supported on this device or simulator. Number: ${phoneNumber}`,
            );
            setIsCallNotSupportedModalVisible(true);
          }
        })
        .catch(err => {
          console.error('An error occurred while trying to make a call', err);
          setCallNotSupportedMessage(
            `An error occurred while trying to make a call: ${
              err.message || 'Unknown error'
            }`,
          );
          setIsCallNotSupportedModalVisible(true);
        });
    } else {
      setCallNotSupportedMessage('Phone number not available for this salon.');
      setIsCallNotSupportedModalVisible(true);
    }
  };

  // Function to handle getting directions
  const handleGetDirections = () => {
    if (coordinate && coordinate.latitude && coordinate.longitude) {
      const lat = coordinate.latitude;
      const lng = coordinate.longitude;
      const url = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}(${encodeURIComponent(
          title || 'Place',
        )})`,
        android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(
          title || 'Place',
        )})`,
        default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      });

      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            setMapNotSupportedMessage(
              'Map application not found or supported on this device.',
            );
            setIsMapNotSupportedModalVisible(true);
            console.log("Don't know how to open URI: " + url);
          }
        })
        .catch(err => {
          console.error('An error occurred while trying to open map', err);
          setMapNotSupportedMessage(
            `An error occurred while trying to open map: ${
              err.message || 'Unknown error'
            }`,
          );
          setIsMapNotSupportedModalVisible(true);
        });
    } else {
      setMapNotSupportedMessage(
        'Location coordinates not available for this salon.',
      );
      setIsMapNotSupportedModalVisible(true);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Services':
        return (
          <View style={styles.gridContainer}>
            {SERVICES.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.gridItem,
                  (index + 1) % 4 !== 0 && styles.marginRight, // Add marginRight unless it's the 4th item
                ]}>
                <Image source={item.image} style={styles.gridImage} />
                <Text style={styles.gridText}>{item.title}</Text>
              </View>
            ))}
          </View>
        );
      case 'Photos':
        if (loadingDetails) {
          return (
            <View style={styles.photoStatusContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.photoStatusText}>Loading photos...</Text>
            </View>
          );
        }
        if (detailsError) {
          return (
            <View style={styles.photoStatusContainer}>
              <Text style={styles.statusErrorText}>Error: {detailsError}</Text>
            </View>
          );
        }
        if (fetchedPhotos.length === 0) {
          return (
            <View style={styles.photoStatusContainer}>
              <Text style={styles.photoStatusText}>
                No photos available for this salon.
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.fetchedPhotoContainer}>
            {fetchedPhotos.map((photo, index) => (
              <Image
                key={index}
                source={{
                  uri: `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${Strings.GOMAPS_API_KEY}`,
                }}
                style={[
                  styles.fetchedPhotoItem,
                  (index + 1) % 4 !== 0 && styles.marginRight, // Add marginRight unless it's the 4th item
                ]}
              />
            ))}
          </View>
        );
      case 'About':
        return (
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutHeading}>About</Text>
            {loadingDetails ? (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={{marginVertical: 10}}
              />
            ) : detailsError ? (
              <Text style={styles.statusErrorText}>
                Could not load about details: {detailsError}
              </Text>
            ) : (
              <Text style={styles.aboutText}>
                {description ||
                  'No detailed description available for this salon.'}
              </Text>
            )}

            <Text style={styles.aboutHeading}>Amenities</Text>
            {loadingDetails ? (
              <ActivityIndicator
                size="small"
                color="#0000ff"
                style={{marginVertical: 10}}
              />
            ) : detailsError ? (
              <Text style={styles.statusErrorText}>
                Could not load amenities: {detailsError}
              </Text>
            ) : amenities.length > 0 ? (
              <View style={styles.amenitiesList}>
                {amenities.map((amenity, idx) => (
                  <Text key={idx} style={styles.amenityItem}>
                    • {amenity}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={styles.aboutText}>
                No specific amenities listed for this salon.
              </Text>
            )}
          </View>
        );
      case 'Reviews':
        if (loadingDetails) {
          return (
            <View style={styles.reviewStatusContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.reviewStatusText}>Loading reviews...</Text>
            </View>
          );
        }
        if (detailsError) {
          return (
            <View style={styles.reviewStatusContainer}>
              <Text style={styles.statusErrorText}>Error: {detailsError}</Text>
            </View>
          );
        }
        if (reviews.length === 0) {
          return (
            <View style={styles.reviewStatusContainer}>
              <Text style={styles.reviewStatusText}>
                No reviews available yet for this salon.
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.reviewsListContainer}>
            {reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  {review.profile_photo_url && (
                    <Image
                      source={{uri: review.profile_photo_url}}
                      style={styles.reviewerImage}
                    />
                  )}
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>
                      {review.author_name}
                    </Text>
                    <Text style={styles.reviewRating}>
                      {'⭐'.repeat(review.rating)} {review.rating}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewTime}>
                  {review.relative_time_description}
                </Text>
              </View>
            ))}
          </View>
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
            title={title || 'Salon Details'}
            showBack={true}
            onBackPress={goBack}
          />

          <HeaderImageCarousel images={HEADER_IMAGES} duration={5000} />

          <View style={styles.infoContainer}>
            <Text style={styles.salonName}>{title}</Text>
            <Text style={styles.address}>{address}</Text>
            <Text style={styles.subText}>Unisex · ₹₹</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.openText}>
                {isOpen ? '🟢 Open now' : '🔴 Closed'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsHoursModalVisible(true)}
                style={styles.hoursDropdownContainer}
                disabled={
                  !fetchedFullOpeningHours ||
                  fetchedFullOpeningHours.length === 0
                }>
                <Text style={styles.timeText}>
                  {displayTodayHours || 'Hours not available'}
                </Text>
                {fetchedFullOpeningHours &&
                  fetchedFullOpeningHours.length > 0 && (
                    <Text style={styles.dropdownIcon}>▼</Text>
                  )}
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGetDirections}
                disabled={!coordinate || loadingDetails}>
                <Text>📍 Get Directions ({distanceKm} Km)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleCall}
                disabled={!phoneNumber || loadingDetails}>
                <Text>📞 Contact</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.offerCard}>
              <Text style={styles.offerTitle}>🎉 Get 40% OFF</Text>
              <Text>25% Discount + 15% Cashback</Text>
            </View>
          </View>

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

        {/* Hours Modal - New Design */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isHoursModalVisible}
          onRequestClose={() => setIsHoursModalVisible(false)}>
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setIsHoursModalVisible(false)}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Timings</Text>
                <Text style={styles.modalHeaderSubtitle}>
                  All Timings Are In IST
                </Text>
              </View>

              {fetchedFullOpeningHours && fetchedFullOpeningHours.length > 0 ? (
                fetchedFullOpeningHours.map((dayHour, index) => {
                  const parts = dayHour.split(': ');
                  const day = parts[0];
                  const time = parts.slice(1).join(': ');

                  return (
                    <View key={index} style={[styles.modalTimingRow]}>
                      <Text
                        style={[
                          styles.modalTextDay,
                          index === currentDayIndexForModal &&
                            styles.highlightedDayText,
                        ]}>
                        {day}
                      </Text>
                      <Text
                        style={[
                          styles.modalTextTime,
                          index === currentDayIndexForModal &&
                            styles.highlightedDayText,
                        ]}>
                        {time}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.modalTextDay}>
                  No detailed operating hours available.
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Call Not Supported Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isCallNotSupportedModalVisible}
          onRequestClose={() => setIsCallNotSupportedModalVisible(false)}>
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setIsCallNotSupportedModalVisible(false)}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Call Not Supported</Text>
              </View>
              <Text
                style={[
                  styles.modalTextDay,
                  {padding: 20, textAlign: 'center'},
                ]}>
                {callNotSupportedMessage}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsCallNotSupportedModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Map Not Supported Modal - ADDED */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isMapNotSupportedModalVisible}
          onRequestClose={() => setIsMapNotSupportedModalVisible(false)}>
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setIsMapNotSupportedModalVisible(false)}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>Map Not Supported</Text>
              </View>
              <Text
                style={[
                  styles.modalTextDay,
                  {padding: 20, textAlign: 'center'},
                ]}>
                {mapNotSupportedMessage}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsMapNotSupportedModalVisible(false)}>
                <Text style={styles.modalCloseButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
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
    alignItems: 'center',
  },
  openText: {
    color: 'green',
  },
  hoursDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  timeText: {
    color: '#333',
    marginRight: 5,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#555',
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
    paddingHorizontal: 10, // Keep padding to control overall grid offset
    marginTop: 10,
  },
  gridItem: {
    width: (width - 20 - 3 * 8) / 4, // Calculate width for 4 images in a row with 10px horizontal padding and 8px gap
    alignItems: 'center',
    marginBottom: 10, // Vertical spacing between rows
  },
  gridImage: {
    width: 60, // Original size as requested
    height: 60, // Original size as requested
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
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  photoText: {
    marginTop: 4,
  },
  // New styles for fetched photos
  fetchedPhotoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10, // Add padding on the sides
    paddingVertical: 10,
  },
  fetchedPhotoItem: {
    width: (width - 20 - 3 * 8) / 4, // Calculate width for 4 images in a row with 10px horizontal padding and 8px gap
    height: (width - 20 - 3 * 8) / 4, // Make it square, matching the width
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 10, // Vertical spacing between rows
  },
  marginRight: {
    marginRight: 8, // Gap between items
  },
  photoStatusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 60,
  },
  photoStatusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  aboutContainer: {
    padding: 16,
  },
  aboutHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  aboutText: {
    marginTop: 4,
    color: '#444',
  },
  amenitiesList: {
    marginTop: 8,
    paddingLeft: 10,
  },
  amenityItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
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
  // Styles for reviews
  reviewsListContainer: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewRating: {
    fontSize: 12,
    color: '#FFD700',
  },
  reviewText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 5,
  },
  reviewTime: {
    fontSize: 11,
    color: '#777',
    textAlign: 'right',
  },
  reviewStatusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 100,
  },
  reviewStatusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  statusErrorText: {
    marginTop: 10,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  // Styles for the Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '70%',
  },
  modalHeader: {
    width: '100%',
    backgroundColor: '#61a3ff',
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalHeaderTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalHeaderSubtitle: {
    color: 'white',
    fontSize: 12,
  },
  modalTimingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTextDay: {
    fontSize: 16,
    color: '#333',
  },
  modalTextTime: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  highlightedDayText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#00aaff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
