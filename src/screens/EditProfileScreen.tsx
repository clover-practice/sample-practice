// screens/EditProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import { goBack } from '../utils/NavigationUtils';

const EditProfileScreen = () => {
//   const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Ayala Heights"
        showBack={true}
        showFavorite={false}
        showShare={false}
        onBackPress={() =>  goBack()}
      />

      <Text style={styles.text}>Edit Profile Content</Text>
    </View>
  );
};

export default EditProfileScreen;

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

