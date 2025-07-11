import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import { useTabBarVisibility } from '../components/TabBarVisibilityContext';
import CustomHeader from '../components/CustomHeader';

const LEFT_MENU = [
  { id: '1', title: 'For You', icon: require('../assets/images/user.jpg') },
  { id: '2', title: 'Grocery', icon: require('../assets/images/user.jpg') },
  { id: '3', title: 'Fashion', icon: require('../assets/images/user.jpg') },
  { id: '4', title: 'Appliances', icon: require('../assets/images/user.jpg') },
  { id: '5', title: 'Mobiles', icon: require('../assets/images/user.jpg') },
  { id: '6', title: 'Electronics', icon: require('../assets/images/user.jpg') },
  { id: '7', title: 'Smart Gadgets', icon: require('../assets/images/user.jpg') },
  { id: '8', title: 'Home', icon: require('../assets/images/user.jpg') },
  { id: '9', title: 'Beauty & Personal Care', icon: require('../assets/images/user.jpg') },
];

const POPULAR_STORES = [
  { id: '1', title: 'Sale is Live', icon: require('../assets/images/user.jpg') },
  { id: '2', title: 'Wishlist now', icon: require('../assets/images/user.jpg') },
  { id: '3', title: 'Claim Now', icon: require('../assets/images/user.jpg') },
  { id: '4', title: 'Flipkart Minutes', icon: require('../assets/images/user.jpg') },
  { id: '5', title: "Kid's Zone", icon: require('../assets/images/user.jpg') },
];

const RECENTLY_VIEWED = [
  { id: '1', title: 'Men’s Casual Shoes', icon: require('../assets/images/user.jpg') },
  { id: '2', title: 'Massagers', icon: require('../assets/images/user.jpg') },
  { id: '3', title: 'Water Purifier', icon: require('../assets/images/user.jpg') },
];

const HAVE_YOU_TRIED = [
  { id: '1', title: 'Flipkart UPI', icon: require('../assets/images/user.jpg') },
  { id: '2', title: 'SuperCoin', icon: require('../assets/images/user.jpg') },
  { id: '3', title: 'Plus Zone', icon: require('../assets/images/user.jpg') },
  { id: '4', title: 'Recharge', icon: require('../assets/images/user.jpg') },
  { id: '5', title: 'Pay', icon: require('../assets/images/user.jpg') },
  { id: '6', title: 'Loan ₹10L', icon: require('../assets/images/user.jpg') },
];

const CategoryScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const { translateY } = useTabBarVisibility();
  const scrollY = useSharedValue(0);
  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
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

  const renderLeftMenu = ({ item }: any) => (
    <TouchableOpacity onPress={() => setSelectedCategory(item.id)}>
      <View style={[styles.menuItem, selectedCategory === item.id && styles.selectedMenu]}>
        <Image source={item.icon} style={styles.menuIcon} />
        <Text style={[styles.menuText, selectedCategory === item.id && styles.selectedText]}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalSection = (title: string, data: any[]) => (
    <View >
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
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
    <View style={styles.containerMain}>
      {/* <CustomHeader /> */}
    <View style={styles.container}> 
      <View style={styles.sidebar}>
        <FlatList
          data={LEFT_MENU}
          renderItem={renderLeftMenu}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>

      <View style={styles.content}>
        
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {renderHorizontalSection('Popular Store', POPULAR_STORES)}
          {renderHorizontalSection('Recently Viewed Stores', RECENTLY_VIEWED)}
          {renderHorizontalSection('Have you tried?', HAVE_YOU_TRIED)}
          {renderHorizontalSection('Try again?', HAVE_YOU_TRIED)}
          {renderHorizontalSection('Try again?', HAVE_YOU_TRIED)}
          {renderHorizontalSection('Try again?', HAVE_YOU_TRIED)}
          {renderHorizontalSection('Try again?', HAVE_YOU_TRIED)}
          {renderHorizontalSection('Try again?', HAVE_YOU_TRIED)}
          {renderHorizontalSection('Try again?', HAVE_YOU_TRIED)}
          <View style={{ marginBottom: 100 }} />
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#F5F6F8',
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
  selectedMenu: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#2874F0',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#2874F0',
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
  itemLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
});
