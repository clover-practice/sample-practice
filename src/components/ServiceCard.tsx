import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';

const {width} = Dimensions.get('window');

interface ServiceCardProps {
  title: string;
  icon?: any;
  unpaidAmount?: number;
  datetime: string;
  onPayPress?: () => void;
  onAddServicePress?: () => void;
  onTogglePress?: () => void;
  containerStyle?: ViewStyle;
  isExpanded?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  icon,
  unpaidAmount = 0,
  datetime,
  onPayPress,
  onAddServicePress,
  onTogglePress,
  containerStyle,
  isExpanded = false,
}) => {
  const parts = datetime.split(' ');
  const date = parts.slice(0, 3).join(' '); // "18 Aug, 2025"
  const time = parts.slice(3).join(' '); // "11:22 AM"
  return (
    <View style={[styles.card, containerStyle]}>
      {/* Row 1: Title and Toggle */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={onTogglePress}>
          <Ionicons
            name={isExpanded ? 'chevron-down-outline' : 'chevron-up-outline'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      {/* Row 2: Icon and Add Service */}
      <View style={styles.row2}>
        {icon && <Image source={icon} style={styles.icon} />}
        <View style={{flex: 1}} />
        <TouchableOpacity
          style={styles.addServiceButton}
          onPress={onAddServicePress}>
          <Text style={styles.addServiceText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {/* Row 3: Title + Unpaid | Pay | Date & Time */}

      <View style={styles.row3}>
        <View style={styles.leftSection}>
          <View style={styles.leftBlock}>
            <Text style={styles.subTitle}>{title}</Text>
            <Text style={styles.unpaidText}>Unpaid {unpaidAmount}</Text>
          </View>
          <TouchableOpacity style={styles.payButton} onPress={onPayPress}>
            <Text style={styles.payText}>Pay</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightBlock}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <View style={styles.devider}></View>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },

  // Row 1
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  // Row 2
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  addServiceButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addServiceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Row 3
  row3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  leftBlock: {
    justifyContent: 'center',
  },

  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  unpaidText: {
    fontSize: 12,
    color: '#666',
  },

  payButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 15,
  },

  payText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
  },

  time: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222',
  },
  leftColumn: {
    flex: 1,
  },
  datetime: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  devider: {
    height: 2,
    backgroundColor: colors.GRAY_LIGHT,
    marginTop: 4,
  },
});
