import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  GestureResponderEvent,
  View,
  Platform,
} from 'react-native';
import Colors from '../constants/colors';

type CustomButtonProps = {
  title: string;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: (event: GestureResponderEvent) => void;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  backgroundColor = Colors.PRIMARY,
  textColor = Colors.WHITE,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? Colors.GRAY : backgroundColor,
          opacity: isDisabled ? 0.7 : 1,
        },
        style, // allow override from props
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? (
            <View style={styles.leftIcon}>{leftIcon}</View>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}

          <Text style={[styles.label, {color: textColor}, textStyle]}>
            {title}
          </Text>

          {rightIcon ? (
            <View style={styles.rightIcon}>{rightIcon}</View>
          ) : (
            <View style={styles.iconPlaceholder} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center', // ensures content-size button is centered
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  iconPlaceholder: {
    width: 20, // same width as icon to maintain layout
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;
