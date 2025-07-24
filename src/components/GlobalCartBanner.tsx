import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCart} from '../contexts/CartContext';
import Colors from '../constants/colors';
import responsive from '../utils/responsive';

const GlobalCartBanner = () => {
  const {items} = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (items.length > 0) setVisible(true);
    else setVisible(false);
  }, [items]);

  if (!visible) return null;

  return (
    <View style={styles.cartBanner}>
      <View style={styles.cartBannerLeft}>
        <Text style={styles.cartBannerText}>Bruno's Salon</Text>
        <Text style={styles.cartBannerSubText}>
          {items.length} item{items.length > 1 ? 's' : ''} in cart
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => console.log('Navigate to cart screen')}
        style={styles.viewCartButton}>
        <Text style={styles.viewCartText}>View Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Ionicons
          name="close"
          size={22}
          color="#000"
          style={{marginLeft: 10}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default GlobalCartBanner;

const styles = StyleSheet.create({
  cartBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopColor: Colors.BORDER_COLOR,
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartBannerLeft: {
    flex: 1,
  },
  cartBannerText: {
    fontSize: responsive.fontSize(13),
    fontWeight: '600',
    color: '#000',
  },
  cartBannerSubText: {
    fontSize: responsive.fontSize(12),
    color: '#555',
  },
  viewCartButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.fontSize(12),
  },
});
