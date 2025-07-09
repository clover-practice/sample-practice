import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TAB_LIST, TabName } from './TabContent';

interface Props {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const TabBar: React.FC<Props> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.tabBar}>
      {TAB_LIST.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => onTabPress(tab)} style={styles.tabButton}>
          <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'space-around',
  },
  tabButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTab: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  indicator: {
    height: 3,
    width: '100%',
    backgroundColor: '#007BFF',
    marginTop: 4,
  },
});
