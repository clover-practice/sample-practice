import React, { useRef, useState } from 'react';
import { ScrollView, View, StyleSheet, NativeScrollEvent, NativeSyntheticEvent ,Share} from 'react-native';
import PromoBanner from '../components/PromoBanner';
import TabBar from '../components/TabBar';
import TabContent, { TAB_LIST, TabName } from '../components/TabContent';
import CustomHeader from '../components/CustomHeader';
import { goBack, navigate } from '../utils/NavigationUtils'; 
 

const ServiceMenuScreen = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<TabName>('Services');
  const sectionPositions = useRef<Record<TabName, number>>({
    Services: 0,
    Photo: 0,
    About: 0,
    Review: 0,
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    let currentTab: TabName = 'Services';
    for (const tab of TAB_LIST) {
      const top = sectionPositions.current[tab];
      if (y >= top - 100) currentTab = tab;
    }

    setActiveTab(currentTab);
  };

  const handleTabPress = (tab: TabName) => {
    const y = sectionPositions.current[tab];
    scrollRef.current?.scrollTo({ y, animated: true });
    setActiveTab(tab);
  };

  const onLayoutCapture = (tab: TabName, y: number) => {
    sectionPositions.current[tab] = y;
  };


const onSharePress = async () => {
  try {
    const result = await Share.share({
      message: 'Check out this awesome service at Ayala Heights!',
      url: 'https://example.com/ayala-heights', // Optional
      title: 'Ayala Heights Service',
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared with activity type:', result.activityType);
      } else {
        console.log('Shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};



  return (
    <View style={styles.container}>

      <CustomHeader
        title="Ayala Heights "
        showBack={true}
        showFavorite={true}  
        showShare={true}
        onBackPress={() =>  goBack() }
        onFavoritePress={() => console.log('Fav')}
        onSharePress={() => onSharePress()}

      />
    <ScrollView
      ref={scrollRef} 
      stickyHeaderIndices={[1]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
     

      <PromoBanner
        promoText="A new way to be fresh this summer!"
        bannerImage={require('../assets/images/banner.png')}
      />

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} /> 
      <TabContent onSectionLayout={onLayoutCapture} />
      </ScrollView>
      </View>
  );
};

export default ServiceMenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 100,
    fontSize: 18,
    textAlign: 'center',
  },
});

