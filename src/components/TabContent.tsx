import React from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';

export const TAB_LIST = ['Services', 'Photo', 'About', 'Review'] as const;
export type TabName = typeof TAB_LIST[number];

interface Props {
  onSectionLayout: (tab: TabName, y: number) => void;
  activeTab?: TabName; // Add this prop to highlight the current tab
}

const TabContent: React.FC<Props> = ({ onSectionLayout, activeTab }) => {
  return (
    <>
      {TAB_LIST.map((tab, index) => (
        <View
          key={tab}
          onLayout={(e: LayoutChangeEvent) =>
            onSectionLayout(tab, e.nativeEvent.layout.y)
          }
          style={[
            styles.section,
            tab === activeTab ? styles.activeSection : null, // Add extra padding only to the active section
          ]}
        >
          <Text style={styles.sectionTitle}>{tab}</Text>
          <Text style={styles.sectionContent}>
            Content for {tab} section goes here... Add more data as needed.
          </Text>
        </View>
      ))}
    </>
  );
};

export default TabContent;

const styles = StyleSheet.create({
  section: {
    padding: 20,
    minHeight: 400,
    borderBottomWidth: 1,
    borderColor: '#eee', 
  },
  activeSection: {
    paddingTop: 40, // Adds space so heading is visible below tabs
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
  },
});
