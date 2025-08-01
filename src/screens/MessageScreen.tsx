import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button,
} from 'react-native';

import React from 'react';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import KeyboardAvoidingWrapper from '../utils/KeyboardAvoidingWrapper';

const MessageScreen = () => {
  return (
    //   <View style={styles.safeArea}>
    //     <CustomHeader
    //       title="Message"
    //       showBack={true}
    //       onBackPress={() => goBack()}
    //     />
    //     <KeyboardAvoidingWrapper containerStyle={styles.containerStyle}>
    //       <Text>Anil</Text>
    //     </KeyboardAvoidingWrapper>
    //   </View>
    // );

    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Sticky Header</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {Array.from({length: 30}).map((_, index) => (
          <View key={index} style={styles.item}>
            <Text>Item {index + 1}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <Button title="Sticky Footer Button" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  containerStyle: {
    paddingHorizontal: 10,

    paddingBottom: 60,
  },
  header: {
    height: 60,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingBottom: 80, // Add space so last item doesn't go behind footer
  },
  item: {
    height: 60,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 5,
  },
  footer: {
    height: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
});
