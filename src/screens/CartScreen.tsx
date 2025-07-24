import React from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useCart} from '../contexts/CartContext';
import Colors from '../constants/colors';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import responsive from '../utils/responsive';
import {ScrollView} from 'react-native-gesture-handler';
import Constants from '../constants/Constants';

const CartScreen = () => {
  const {items, removeItem, clearCart} = useCart(); // ✅ Correct names

  return (
    <View style={styles.safeArea}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={Colors.STATUS_BAR_COLOR}
          barStyle="dark-content"
        />

        <CustomHeader
          title={'Added Items'}
          showBack={true}
          onBackPress={goBack}
        />
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View style={styles.scrollContainer}>
              <Text>{item.title}</Text>
              <Text>${item.price}</Text>
              <Button title="Remove" onPress={() => removeItem(item.id)} />
            </View>
          )}
        />
      </SafeAreaView>
      <Button title="Clear Cart" onPress={clearCart} />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollContainer: {
    padding: responsive.padding(Constants.SCREEN_PADDING),
    paddingBottom: responsive.padding(Constants.BOTTOM_PADDING),
  },
  card: {
    backgroundColor: 'black',
    height: 140,
    borderRadius: 8,
    justifyContent: 'space-between',
    padding: 12,
  },
});
