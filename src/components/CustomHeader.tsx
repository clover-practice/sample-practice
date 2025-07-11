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

interface Props {
  title?: string;
  showBack?: boolean;
  showFavorite?: boolean;
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
  onBackPress,
  onFavoritePress,
  onSharePress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.side}>
          {showBack && (
            <TouchableOpacity onPress={onBackPress}>
              <Ionicons name="chevron-back-outline" size={26} color="#000" />
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
            <TouchableOpacity onPress={onFavoritePress} style={styles.iconSpacing}>
              <Ionicons name="heart-outline" size={22} color="#000" />
            </TouchableOpacity>
          )}
          {showShare && (
            <TouchableOpacity onPress={onSharePress}>
              <Ionicons name="share-social-outline" size={22} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  side: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  sideRight: {
    width: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 12,
  },
});
