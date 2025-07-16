// components/CustomHeader.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import responsive from '../utils/responsive';

interface Props {
  title?: string;
  showBack?: boolean;
  showFavorite?: boolean;
  isFavorite?: boolean;
  showShare?: boolean;
  onBackPress?: () => void;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
}

const CustomHeader: React.FC<Props> = ({
  title,
  showBack = false,
  showFavorite = false,
  showShare = false,
  isFavorite = false,
  onBackPress,
  onFavoritePress,
  onSharePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress}>
            <Ionicons
              name="chevron-back-outline"
              size={responsive.fontSize(26)}
              color="#000"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.sideRight}>
        {showFavorite && (
          <TouchableOpacity
            onPress={onFavoritePress}
            style={styles.iconSpacing}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={responsive.fontSize(22)}
              color={isFavorite ? 'red' : '#000'}
            />
          </TouchableOpacity>
        )}
        {showShare && (
          <TouchableOpacity onPress={onSharePress}>
            <Ionicons
              name="share-social-outline"
              size={responsive.fontSize(22)}
              color="#000"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    height: responsive.height(56),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.padding(16),
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  side: {
    width: responsive.width(40),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: responsive.fontSize(17),
    fontWeight: '600',
  },
  sideRight: {
    width: responsive.width(40),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: responsive.margin(12),
  },
});
