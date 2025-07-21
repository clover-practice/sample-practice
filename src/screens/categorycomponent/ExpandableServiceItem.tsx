import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import responsive from '../../utils/responsive';
import colors from '../../constants/colors';

const dummyItems = [
  {
    id: '1',
    title: 'Basic Haircut',
    price: '150',
  },
  {
    id: '2',
    title: 'Advanced Haircut',
    price: '250',
  },
  {
    id: '3',
    title: 'Premium Haircut',
    price: '400',
  },
];

const ExpandableServiceItem = ({
  title,
  count,
  dummyItems,
}: {
  title: string;
  count: number;
  dummyItems: {
    id: string;
    title: string;
    price: string;
    image?: string;
  }[];
}) => {
  const [expanded, setExpanded] = useState(false);

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
      {/* ======================================== SINGLE ROW DESIGH ======================================== */}
      {/* Expanded Items */}
      {expanded &&
        dummyItems.slice(0, count).map((item, index, array) => (
          <View
            key={item.id}
            style={[
              styles.card,
              index !== dummyItems.length - 1 && styles.cardWithDivider,
            ]}>
            {/* Icon */}
            <View style={styles.cardLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="woman-outline"
                  size={responsive.fontSize(24)}
                  color={colors.BLACK}
                />
              </View>

              <Text style={styles.title}>{item.title}</Text>
              {/* Price + Customize */}
              <View style={styles.rowBetween}>
                <Text style={styles.price}>From ₹{item.price} + GST</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>ADD</Text>
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
  container: {
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerText: {
    fontSize: responsive.fontSize(14),
    fontWeight: '600',
    color: '#000',
  },
  sectionGroup: {
    marginTop: responsive.margin(10),
    marginBottom: responsive.margin(5),
    backgroundColor: '#fff',
    padding: 5,
    // Add shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0.3},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    // Elevation (Android)
    elevation: 1,
  },
  card: {
    marginTop: 12,
    backgroundColor: '#fff',
    padding: 12,
    shadowColor: '#000',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cardLeft: {
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'column',
    shadowColor: '#000',
  },
  cardWithDivider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    marginBottom: 10,
    paddingBottom: 10,
  },
  iconContainer: {
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: responsive.fontSize(13),
    fontWeight: '600',
    color: '#222',
  },
  price: {
    fontSize: responsive.fontSize(12),
    color: '#444',
  },
  addButton: {
    backgroundColor: colors.PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: responsive.fontSize(12),
    fontWeight: '600',
  },
  customizeText: {
    fontSize: responsive.fontSize(11),
    color: '#666',
    marginTop: 5,
  },
});
