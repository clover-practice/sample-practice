import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  runOnJS,
  useAnimatedRef,
  scrollTo,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TABS = ['Service', 'Photo', 'Review', 'About Product'];

const StickyTabScroll = () => {
  const scrollY = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const sectionRefs = {
    Service: useRef<View>(null),
    Photo: useRef<View>(null),
    Review: useRef<View>(null),
    'About Product': useRef<View>(null),
  };

  const sectionPositions = useRef<Record<string, number>>({}).current;
  const [activeTab, setActiveTab] = useState<string>('Service');

  const TAB_BAR_TOP = 150;
  const TAB_BAR_HEIGHT = 60;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      const y = event.contentOffset.y;
      let current = 'Service';
      const sorted = Object.entries(sectionPositions).sort((a, b) => a[1] - b[1]);
      for (let i = 0; i < sorted.length; i++) {
        if (y + TAB_BAR_HEIGHT >= sorted[i][1]) {
          current = sorted[i][0];
        } else {
          break;
        }
      }

      runOnJS(setActiveTab)(current);
    },
  });

  const tabBarStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: scrollY.value >= TAB_BAR_TOP ? 0 : TAB_BAR_TOP - scrollY.value,
    zIndex: 10,
  }));

  const handleTabPress = (tab: string) => {
    const y = sectionPositions[tab];
    if (y != null) {
      runOnJS(setActiveTab)(tab);
      scrollTo(scrollRef, 0, y - TAB_BAR_HEIGHT, true);
    }
  };

  return (
    <View style={styles.container}>
       
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: TAB_BAR_TOP + TAB_BAR_HEIGHT }}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.sectionTitle}>👋 Welcome</Text>
          <Text style={styles.subText}>Scroll down to see sticky tabs</Text>
        </View>

        {/* Section: Service */}
        <View
          ref={sectionRefs.Service}
          onLayout={(e) =>
            (sectionPositions['Service'] =
              e.nativeEvent.layout.y + TAB_BAR_TOP + TAB_BAR_HEIGHT)
          }
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>🛠️ Service</Text>
          <Text style={styles.subText}>Details about the service offered.</Text>
        </View>

        {/* Section: Photo */}
        <View
          ref={sectionRefs.Photo}
          onLayout={(e) =>
            (sectionPositions['Photo'] =
              e.nativeEvent.layout.y + TAB_BAR_TOP + TAB_BAR_HEIGHT)
          }
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>📷 Photo</Text>
          <Text style={styles.subText}>Gallery of product images.</Text>
        </View>

        {/* Section: Review */}
        <View
          ref={sectionRefs.Review}
          onLayout={(e) =>
            (sectionPositions['Review'] =
              e.nativeEvent.layout.y + TAB_BAR_TOP + TAB_BAR_HEIGHT)
          }
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>📝 Review</Text>
          <Text style={styles.subText}>Customer feedback and ratings.</Text>
        </View>

        {/* Section: About Product */}
        <View
          ref={sectionRefs['About Product']}
          onLayout={(e) =>
            (sectionPositions['About Product'] =
              e.nativeEvent.layout.y + TAB_BAR_TOP + TAB_BAR_HEIGHT)
          }
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>📦 About Product</Text>
          <Text style={styles.subText}>Information about the product.</Text>
        </View>
      </Animated.ScrollView>

      {/* Sticky Tab Bar */}
      <Animated.View style={[styles.tabBar, tabBarStyle]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={styles.tabItem}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

export default StickyTabScroll;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  welcomeSection: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#ddeeff',
    marginHorizontal: 10,
    borderRadius: 12,
  },
  section: {
    height: SCREEN_HEIGHT * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
  tabBar: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  activeTabText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
});
