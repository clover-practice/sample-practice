import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import responsive from '../utils/responsive';

interface Props {
  title: string;
  showBack?: boolean;
  showShare?: boolean;
  onBackPress?: () => void;
  onSharePress?: () => void;
  rightIconName?: string; // Ionicons by default
  iconLibrary?: 'Ionicons' | 'MaterialIcons'; // Optional icon library
}

const CustomHeader: React.FC<Props> = ({
  title,
  showBack = false,
  showShare = false,
  onBackPress,
  onSharePress,
  rightIconName = 'share-social-outline',
  iconLibrary = 'Ionicons',
}) => {
  const renderRightIcon = () => {
    if (!showShare) return null;
    const IconComponent =
      iconLibrary === 'MaterialIcons' ? MaterialIcons : Ionicons;

    return (
      <TouchableOpacity onPress={onSharePress}>
        <IconComponent
          name={rightIconName}
          size={responsive.fontSize(22)}
          color="#000"
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons
            name="chevron-back-outline"
            size={responsive.fontSize(26)}
            color="#000"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      {renderRightIcon() || <View style={styles.placeholder} />}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: responsive.padding(6),
    paddingHorizontal: responsive.padding(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: responsive.fontSize(18),
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: responsive.width(26), // to keep spacing consistent
  },
});
