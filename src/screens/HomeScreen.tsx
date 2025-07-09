import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import TopSearchBar from '../components/HomeHeaderComponent'; 
import BreakerText from '../components/BreakerText';
 
import { navigate } from '../utils/NavigationUtils';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated'; 
import { useTabBarVisibility } from '../components/TabBarVisibilityContext';
import CustomCarousel from '../components/CustomCarousel';

const HomeScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { translateY } = useTabBarVisibility();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = currentY - scrollY.value;

      if (diff > 10) {
        translateY.value = withTiming(tabBarHeight, { duration: 200 });
      } else if (diff < -10) {
        translateY.value = withTiming(0, { duration: 200 });
      }

      scrollY.value = currentY;
    },
  });

  const name = "R";
  const firstChar = name.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TopSearchBar
          city="Mumbai"
          offerLabel="50% Offer"
          userInitial={firstChar}
          onPressAvatar={() => navigate('ServiceMenuScreen')}
          onPressLocation={() => navigate('ServiceMenuScreen')}
        />
         
        <CustomCarousel
          data={[
            { id: 1,titleMessage:'A new way to be fresh this summer!', uri: require('../assets/images/banner.png') },
            { id: 2,titleMessage:'A new way to be fresh this summer!', uri: require('../assets/images/banner.png') },
            { id: 3,titleMessage:'A new way to be fresh this summer!', uri: require('../assets/images/banner.png') },
          ]}
        />

        
        <BreakerText text="SALON BY PRODUCTS" />
        <BreakerText text="SALON NEAR BY YOU" />
        <BreakerText text="SALON BY PRODUCTS" />
        <BreakerText text="SALON NEAR BY YOU" />
        <BreakerText text="SALON BY PRODUCTS" />
        <BreakerText text="SALON NEAR BY YOU" />
        <BreakerText text="SALON BY PRODUCTS" />
        <BreakerText text="SALON NEAR BY YOU" />

         

        {/* Spacer to avoid bottom content hiding under tab bar */}
        <View style={{ height: tabBarHeight + 20 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
});













// import { Image, View } from 'react-native';
// import React from 'react';
// import StudentScreen from '../components/StudentScreen';
// import TopSearchBar from '../components/HomeHeaderComponent';
// import PromoBanner from '../components/PromoBanner';
// import BreakerText from '../components/BreakerText';
// import ScrollableTabsScreen from '../components/ScrollableTabsScreen';
// import { navigate } from '../utils/NavigationUtils';

// const HomeScreen = () => {

//   const name = "R";
//   const firstChar = name.charAt(0).toUpperCase(); // "A"
//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff' }}>
//        <TopSearchBar 
//         city="Mumbai" 
//         offerLabel="50% Offer"  
//         userInitial={firstChar}
//         onPressAvatar={() =>  navigate('ServiceMenuScreen')}
//         onPressLocation={() => navigate('ServiceMenuScreen')}
//       />
//       <PromoBanner  promoText={'A new way to be fresh this summer!'} bannerImage={require(('../assets/images/banner.png') ) } />
      
//       <BreakerText text='SALON BY PRODUCTS' />
//       <BreakerText text='SALON NEAR BY YOU'/>
//       <StudentScreen />
       
//     </View>
//   );
// };

// export default HomeScreen;
