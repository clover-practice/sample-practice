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
import {goBack} from '../utils/NavigationUtils';
import Colors from '../constants/colors';
import responsive from '../utils/responsive';
import Constants from '../constants/Constants';
import HaircutWasStyleComponent from './categorycomponent/HaircutWashStyleComponent';

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
    id: '9',
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
          <View style={styles.sidebar}>
            <FlatList
              data={LEFT_MENU}
              renderItem={renderLeftMenu}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>

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
              <HaircutWasStyleComponent title={selectedCategoryTitle} />
              <View style={{marginBottom: 100}} />
            </Animated.ScrollView>
          </View>
        </View>
      </View>
    </SafeAreaView>
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

  buyNowIcon: {
    padding: 3,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#',
    paddingVertical: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
    marginBottom: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  // selectedMenu: {
  //   backgroundColor: '#fff',
  //   borderLeftWidth: 3,
  //   borderLeftColor: '#2874F0',
  // },
  selectedMenu: {
    backgroundColor: '#fff',
    borderRightWidth: 2,
    borderRightColor: '#444',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#444',
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
});
