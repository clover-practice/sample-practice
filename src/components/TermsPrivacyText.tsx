import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  ViewStyle,
  StyleProp,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  prefixText?: string;
  termsLabel?: string;
  privacyLabel?: string;
  onPressTerms?: () => void;
  onPressPrivacy?: () => void;
  center?: boolean;
  textColor?: string;
  linkColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  withBottomInset?: boolean;
  bottomInsetOffset?: number; // NEW: allows reducing/increasing the inset
}

const TermsPrivacyText: React.FC<Props> = ({
  prefixText = 'By booking an appointment, you agree to our',
  termsLabel = 'Terms of Services',
  privacyLabel = 'Privacy Policy',
  onPressTerms,
  onPressPrivacy,
  center = true,
  textColor = '#444',
  linkColor = '#D81B60',
  containerStyle,
  withBottomInset = true,
  bottomInsetOffset = 0,
}) => {
  const insets = useSafeAreaInsets();
  const adjustedBottom = Math.max((insets.bottom || 16) + bottomInsetOffset, 0);

  return (
    <View
      style={[
        styles.container,
        center && {alignItems: 'center'},
        withBottomInset && {paddingBottom: adjustedBottom},
        containerStyle,
      ]}>
      <Text
        style={[
          styles.text,
          center && {textAlign: 'center'},
          {color: textColor},
        ]}>
        {prefixText}{' '}
        <Text style={[styles.link, {color: linkColor}]} onPress={onPressTerms}>
          {termsLabel}
        </Text>{' '}
        and{' '}
        <Text
          style={[styles.link, {color: linkColor}]}
          onPress={onPressPrivacy}>
          {privacyLabel}
        </Text>
        .
      </Text>
    </View>
  );
};

export default TermsPrivacyText;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 14,
  },
});
