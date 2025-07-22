import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {useTabBarVisibility} from '../components/TabBarVisibilityContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../components/CustomHeader';
import {goBack, navigate} from '../utils/NavigationUtils';
import Colors from '../constants/colors';
import responsive from '../utils/responsive';
import ExpandableServiceItem from './categorycomponent/ExpandableServiceItem';
import Constants from '../constants/Constants';
import {useCart} from '../contexts/CartContext';

const LEFT_MENU = [
  {
    id: '1',
    title: 'Hair-cut,Wash & Style',
    icon: require('../assets/images/user.jpg'),
  },
  {id: '2', title: 'Hair Color', icon: require('../assets/images/user.jpg')},
  {id: '3', title: 'Nail Bar', icon: require('../assets/images/user.jpg')},
  {id: '4', title: 'Face', icon: require('../assets/images/user.jpg')},
  {id: '5', title: 'Massage & Spa', icon: require('../assets/images/user.jpg')},
  {id: '6', title: `Men's Groming`, icon: require('../assets/images/user.jpg')},
  {
    id: '7',
    title: 'Waxing,Bleaching & Threading',
    icon: require('../assets/images/user.jpg'),
  },
  {
    id: '8',
    title: 'Beauty & Personal Care',
    icon: require('../assets/images/user.jpg'),
  },
  {
    id: '9',
    title: 'Beauty & Personal Care',
    icon: require('../assets/images/user.jpg'),
  },
  {
    id: '10',
    title: 'Beauty & Personal Care',
    icon: require('../assets/images/user.jpg'),
  },
];

const POPULAR_STORES = [
  {id: '1', title: 'Sale is Live', icon: require('../assets/images/user.jpg')},
  {id: '2', title: 'Wishlist now', icon: require('../assets/images/user.jpg')},
  {id: '3', title: 'Claim Now', icon: require('../assets/images/user.jpg')},
  {
    id: '4',
    title: 'Flipkart Minutes',
    icon: require('../assets/images/user.jpg'),
  },
  {id: '5', title: "Kid's Zone", icon: require('../assets/images/user.jpg')},
];

const RECENTLY_VIEWED = [
  {
    id: '1',
    title: 'Men’s Casual Shoes',
    icon: require('../assets/images/user.jpg'),
  },
  {id: '2', title: 'Massagers', icon: require('../assets/images/user.jpg')},
  {
    id: '3',
    title: 'Water Purifier',
    icon: require('../assets/images/user.jpg'),
  },
];

const HAVE_YOU_TRIED = [
  {id: '1', title: 'Flipkart UPI', icon: require('../assets/images/user.jpg')},
  {id: '2', title: 'SuperCoin', icon: require('../assets/images/user.jpg')},
  {id: '3', title: 'Plus Zone', icon: require('../assets/images/user.jpg')},
  {id: '4', title: 'Recharge', icon: require('../assets/images/user.jpg')},
  {id: '5', title: 'Pay', icon: require('../assets/images/user.jpg')},
  {id: '6', title: 'Loan ₹10L', icon: require('../assets/images/user.jpg')},
];

const CategoryScreen = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('1');
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState(
    'Hair cut, Wash & Style',
  );
  const [selectedGender, setSelectedGender] = useState('');
  const [showCartBanner, setShowCartBanner] = useState(false);
  const {items} = useCart(); // Get current cart items

  const {translateY} = useTabBarVisibility();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - prevScrollY.value;

      if (diff > 10) {
        // Scrolling up – hide tab bar
        translateY.value = withTiming(100);
      } else if (diff < -10) {
        // Scrolling down – show tab bar
        translateY.value = withTiming(0);
      }

      prevScrollY.value = currentY;
    },
  });

  const renderLeftMenu = ({item}: any) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategoryId(item.id);
        setSelectedCategoryTitle(item.title); // ← set title when item is selected
      }}>
      <View
        style={[
          styles.menuItem,
          selectedCategoryId === item.id && styles.selectedMenu,
        ]}>
        <Image source={item.icon} style={styles.menuIcon} />
        <Text
          style={[
            styles.menuText,
            selectedCategoryId === item.id && styles.selectedText,
          ]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalSection = (title: string, data: any[]) => (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.itemLabel}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={Colors.STATUS_BAR_COLOR}
          barStyle="dark-content"
        />
        <CustomHeader
          title={selectedCategoryTitle}
          showBack={true}
          onBackPress={goBack}
        />
        <View style={styles.containerMain}>
          <View style={styles.container}>
            {/* ====================== Side bar(Left Menu)==================== */}
            <View style={styles.sidebar}>
              <FlatList
                data={LEFT_MENU}
                renderItem={renderLeftMenu}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>

            <View style={styles.verticalDivider} />
            {/* ============================ Content ======================== */}
            <View style={styles.content}>
              <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                  <View>
                    <Text style={styles.cardLabel}>Bruno's</Text>
                    <Text style={styles.itemLabelCard}>Gift Card</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => console.log('Clicked on Buy Now')}
                    style={styles.buyNowButton}>
                    <View style={styles.buyNowContent}>
                      <Text style={styles.buyNowText}>Buy Now</Text>
                      <Ionicons
                        name="arrow-forward-outline"
                        size={responsive.fontSize(16)}
                        color="#fff"
                        style={styles.buyNowIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.searchBar}>
                  <Ionicons name="search" size={20} color="#999" />
                  <TextInput
                    style={styles.input}
                    placeholder="Search for services"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* ======================== Gender Button View Details ================================== */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => setSelectedGender('MAN')}
                    style={[
                      styles.buttonGender,
                      selectedGender === 'MAN' && styles.activeBacck,
                    ]}>
                    <View style={styles.buyNowContentGender}>
                      <Ionicons
                        name="man-outline"
                        size={responsive.fontSize(16)}
                        color={selectedGender === 'MAN' ? 'white' : 'red'}
                        style={styles.buyNowIcon}
                      />
                      <Text
                        style={[
                          styles.manWomenText,
                          selectedGender === 'MAN' && styles.activeManWomenText,
                        ]}>
                        {Constants.MAN}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedGender('WOMAN')}
                    style={[
                      styles.buttonGender,
                      selectedGender === 'WOMAN' && styles.activeBacck,
                    ]}>
                    <View style={styles.buyNowContentGender}>
                      <Ionicons
                        name="woman-outline"
                        size={responsive.fontSize(16)}
                        color={selectedGender === 'WOMAN' ? 'white' : 'red'}
                        style={styles.buyNowIcon}
                      />
                      <Text
                        style={[
                          styles.manWomenText,
                          selectedGender === 'WOMAN' &&
                            styles.activeManWomenText,
                        ]}>
                        {Constants.WOMAN}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <ExpandableServiceItem
                  title={'Haircut'}
                  count={3}
                  dummyItems={[
                    {id: '1', title: 'Basic Haircut', price: '150'},
                    {id: '2', title: 'Advanced Haircut', price: '250'},
                    {id: '3', title: 'Premium Haircut', price: '400'},
                  ]}
                  onAddToCart={() => setShowCartBanner(true)}
                />
                <ExpandableServiceItem
                  title="Wash OR Dry"
                  count={4}
                  dummyItems={[
                    {id: '1', title: 'Hair Wash', price: '200'},
                    {id: '2', title: 'Hair Wash', price: '100'},
                    {id: '3', title: 'Hair Wash Regular', price: '250'},
                    {id: '4', title: 'Hair Wash  Premium', price: '250'},
                  ]}
                  onAddToCart={() => setShowCartBanner(true)}
                />
                <ExpandableServiceItem
                  title="Styling"
                  count={5}
                  dummyItems={[
                    {id: '1', title: 'Blow Dry', price: '350'},
                    {id: '2', title: 'Ironing', price: '750'},
                    {id: '3', title: 'Tongs', price: '250'},
                    {id: '4', title: 'Hair Do', price: '1,250'},
                    {id: '5', title: 'Hair Styling', price: '150'},
                  ]}
                  onAddToCart={() => setShowCartBanner(true)} // ✅ Correct
                />
                <View style={{marginBottom: 100}} />
              </Animated.ScrollView>
            </View>
          </View>
        </View>
      </SafeAreaView>
      {/* ==========================Show cart when add the services================================ */}

      {showCartBanner && items.length > 0 && (
        <View style={styles.cartBanner}>
          <View style={styles.cartBannerLeft}>
            <Text style={styles.cartBannerText}>Bruno's Salon</Text>
            <Text style={styles.cartBannerSubText}>
              {items.length} item{items.length > 1 ? 's' : ''} in cart
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigate('AppointmmentBooking');
            }}
            style={styles.viewCartButton}>
            <Text style={styles.viewCartText}>View Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowCartBanner(false)}>
            <Ionicons
              name="close-circle-outline"
              size={22}
              color="#000"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  card: {
    backgroundColor: 'black',
    height: 140,
    borderRadius: 8,
    justifyContent: 'space-between',
    padding: 12,
  },
  buyNowButton: {
    backgroundColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },

  buyNowContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buyNowText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.fontSize(14),
  },

  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#fff',
    paddingBottom: responsive.padding(20),
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 100,
    resizeMode: 'cover',
    marginBottom: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
  },
  menuItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  selectedMenu: {
    backgroundColor: Colors.GRAY_LIGHT,
    borderRightWidth: 1,
    borderRightColor: Colors.GRAY_DARK,
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#444',
  },
  verticalDivider: {
    width: 3,
    backgroundColor: '#E0E0E0', // light gray divider
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  itemContainer: {
    width: 80,
    marginRight: 12,
    alignItems: 'center',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  cardLabel: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 400,
    color: '#fff',
  },
  itemLabelCard: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
  },
  itemLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 12,
    padding: 5,
    borderColor: Colors.BORDER_COLOR,
    borderWidth: 2,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },

  buttonGender: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '45%',
    borderColor: Colors.BORDER_COLOR,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },

  buyNowContentGender: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyNowIcon: {
    padding: 3,
  },
  manWomenText: {
    color: '#000',
    fontWeight: '300',
    fontSize: responsive.fontSize(14),
  },
  activeBacck: {
    backgroundColor: Colors.CARD_COLOR, // active state
  },
  activeManWomenText: {
    color: 'white', // active state
  },
  cartBanner: {
    position: 'absolute',
    bottom: 50, // ⬅️ move it above tab bar
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 2,
    marginBottom: 10,
    borderRadius: 8,
    borderTopColor: Colors.BORDER_COLOR,
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cartBannerLeft: {
    flex: 1,
  },

  cartBannerText: {
    fontSize: responsive.fontSize(13),
    fontWeight: '600',
    color: '#000',
  },

  cartBannerSubText: {
    fontSize: responsive.fontSize(12),
    color: '#555',
  },

  viewCartButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginEnd: 30,
  },

  viewCartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.fontSize(12),
  },
});
