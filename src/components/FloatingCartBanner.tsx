import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCart} from '../contexts/CartContext';

const FloatingCartBanner = ({
  salonName,
  onViewCart,
}: {
  salonName: string;
  onViewCart: () => void;
}) => {
  const {items} = useCart();
  const [visible, setVisible] = useState(true);

  if (!visible || items.length === 0) return null;

  return (
    <View style={styles.banner}>
      <View>
        <Text style={styles.salonName}>{salonName}</Text>
        <Text style={styles.itemCount}>
          {items.length} item{items.length > 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity style={styles.viewCartButton} onPress={onViewCart}>
        <Text style={styles.viewCartText}>View Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setVisible(false)}>
        <Ionicons name="close" size={18} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingCartBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    borderColor: '#ffcdd2',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  salonName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  itemCount: {
    fontSize: 12,
    color: '#777',
  },
  viewCartButton: {
    backgroundColor: '#32B4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: '600',
  },
});
