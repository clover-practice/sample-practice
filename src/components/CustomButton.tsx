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
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.fullRow}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <View style={styles.centerContent}>
            <Text style={[styles.label, { color: textColor }, textStyle]}>
              {title}
            </Text>
          </View>

          {rightIcon ? (
            <View style={styles.rightIcon}>{rightIcon}</View>
          ) : (
            <View style={styles.rightIconPlaceholder} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  fullRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIcon: {
    width: 24,
    alignItems: 'flex-start',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
  },
  rightIcon: {
    width: 24,
    alignItems: 'flex-end',
  },
  rightIconPlaceholder: {
    width: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomButton;



        // leftIcon={<Ionicons name="log-in-outline" size={20} color="white" />}
        // rightIcon={<Ionicons name="chevron-forward" size={20} color="white" />}