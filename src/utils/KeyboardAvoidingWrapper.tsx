import React, {ReactNode} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ViewStyle,
  StatusBar,
  SafeAreaView,
} from 'react-native';

type Props = {
  children: ReactNode;
  containerStyle?: ViewStyle;
  scrollEnabled?: boolean;
  keyboardVerticalOffset?: number;
};

const KeyboardAvoidingWrapper: React.FC<Props> = ({
  children,
  containerStyle,
  scrollEnabled = true,
  keyboardVerticalOffset = 64,
}) => {
  // const topPadding =
  //   Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) + 0 : 50;
  const topPadding = Platform.OS === 'ios' ? 5 : 5;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f9fafb'}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            contentContainerStyle={[
              styles.contentContainer,
              {paddingTop: topPadding},
              containerStyle,
            ]}>
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeyboardAvoidingWrapper;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1, // ✅ This is key
  },
});
