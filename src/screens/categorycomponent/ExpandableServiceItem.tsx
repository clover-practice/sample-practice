import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import responsive from '../../utils/responsive';
import colors from '../../constants/colors';
import {useCart} from '../../contexts/CartContext';

const ExpandableServiceItem = ({
  title,
  count,
  dummyItems,
  onAddToCart,
  isAdded,
}: {
  title: string;
  count: number;
  isAdded?: boolean;
  dummyItems: {
    id: string;
    title: string;
    price: string;
    image?: string;
  }[];
  onAddToCart: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [addedItems, setAddedItems] = useState<{[key: string]: boolean}>({});
  const {addItem} = useCart();

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  return (
    <View style={styles.sectionGroup}>
      {/* Header */}
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.headerText}>{`${title} (${count})`}</Text>
        <Ionicons
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={responsive.fontSize(18)}
          color={colors.ICON_COLOR}
        />
      </TouchableOpacity>

      {/* Expanded List */}
      {expanded &&
        dummyItems.slice(0, count).map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.card,
              index !== dummyItems.length - 1 && styles.cardWithDivider,
            ]}>
            {/* Left Column (icon -> title -> price) */}
            <View style={styles.cardLeft}>
              <Ionicons
                name="woman-outline"
                size={responsive.fontSize(24)}
                color={colors.BLACK}
                style={styles.icon}
              />

              <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {item.title}
              </Text>

              <Text style={styles.price} numberOfLines={2} ellipsizeMode="tail">
                From ₹{` `}
                {item.price} + GST
              </Text>
            </View>

            {/* Right Column (button + customize) */}
            <View style={styles.content}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  addItem(item);
                  setAddedItems(prev => ({...prev, [item.id]: true}));
                  onAddToCart?.(); // callback to show cart banner
                }}>
                <Text style={styles.addButtonText}>
                  {addedItems[item.id] ? 'Added' : 'ADD'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.customizeText}>Customize</Text>
            </View>
          </View>
        ))}
    </View>
  );
};

export default ExpandableServiceItem;
const styles = StyleSheet.create({
  sectionGroup: {
    marginBottom: responsive.margin(5),
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  cardWithDivider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  cardLeft: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 6,
  },
  icon: {
    marginBottom: 4,
  },
  title: {
    fontSize: responsive.fontSize(13),
    fontWeight: '600',
    color: '#222',
    flexShrink: 1,
  },
  price: {
    fontSize: responsive.fontSize(12),
    color: '#444',
    flexShrink: 1,
  },
  content: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    alignSelf: 'center', // ✅ Vertically center the whole right column
    minWidth: 80,
  },
  addButton: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
  },
  customizeText: {
    fontSize: responsive.fontSize(11),
    color: '#666',
  },
});
