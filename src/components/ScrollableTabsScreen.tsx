import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from 'react-native';

const TAB_LIST = ['Services', 'Photo', 'About', 'Review'] as const;
type TabName = typeof TAB_LIST[number];

const ScrollableTabsScreen: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<TabName, number>>({
    Services: 0,
    Photo: 0,
    About: 0,
    Review: 0,
  });

  const [activeTab, setActiveTab] = useState<TabName>('Services');

  const handleTabPress = (tab: TabName) => {
    const y = sectionPositions.current[tab];
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y, animated: true });
    }
  };

  const onSectionLayout = (name: TabName, event: LayoutChangeEvent) => {
    sectionPositions.current[name] = event.nativeEvent.layout.y;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Determine current section based on scroll position
    let currentTab: TabName = 'Services';
    for (const tab of TAB_LIST) {
      const sectionTop = sectionPositions.current[tab];
      if (scrollY >= sectionTop - 100) {
        currentTab = tab;
      }
    }

    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {TAB_LIST.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => handleTabPress(tab)} style={styles.tabButton}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable content */}
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {TAB_LIST.map((tab) => (
          <View
            key={tab}
            onLayout={(e) => onSectionLayout(tab, e)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{tab}</Text>
            <Text style={styles.sectionContent}>Content for {tab} section goes here...</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ScrollableTabsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-around',
  },
  tabButton: {
    paddingHorizontal: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    minHeight: 500,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#444',
  },
});

