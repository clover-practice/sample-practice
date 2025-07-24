import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const Services = () => (
  <View style={styles.tabContent}>
    <Text>Service List</Text>
    {/* Replace with real UI */}
  </View>
);

const Photos = () => (
  <View style={styles.tabContent}>
    <Text>Gallery Photos</Text>
  </View>
);

const About = () => (
  <View style={styles.tabContent}>
    <Text>About the salon...</Text>
  </View>
);

const Reviews = () => (
  <View style={styles.tabContent}>
    <Text>Customer reviews here</Text>
  </View>
);

export default {
  Services,
  Photos,
  About,
  Reviews,
};

const styles = StyleSheet.create({
  tabContent: {
    padding: 16,
    backgroundColor: '#fff',
    minHeight: 300,
  },
});


