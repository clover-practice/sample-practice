import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import responsive from '../utils/responsive';

interface Props {
  title: string;
  showBack?: boolean;
  showShare?: boolean;
  onBackPress?: () => void;
  onSharePress?: () => void;
  rightIconName?: string;
  iconLibrary?: 'Ionicons' | 'MaterialIcons';
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
    if (!showShare) return <View style={styles.placeholder} />;

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
    <SafeAreaView edges={['top']} style={styles.safeArea}>
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

        {renderRightIcon()}
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
    flexDirection: 'row',
    paddingVertical: responsive.padding(6),
    paddingHorizontal: responsive.padding(6),
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
    width: responsive.width(26),
  },
});
