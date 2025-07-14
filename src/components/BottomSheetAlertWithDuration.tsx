import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Easing,
} from 'react-native';

const { height } = Dimensions.get('window');

export type CustomBottomSheetRef = {
  open: (content?: ReactNode) => void;
  close: () => void;
};

const CustomBottomSheet = forwardRef<CustomBottomSheetRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [sheetContent, setSheetContent] = useState<ReactNode>(null);
  const translateY = useRef(new Animated.Value(height)).current;

  const open = (content?: ReactNode) => {
    setSheetContent(content || null);
    setVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const close = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setSheetContent(null);
    });
  };

  useImperativeHandle(ref, () => ({ open, close }));

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableOpacity
        activeOpacity={1}
        style={styles.overlay}
        onPress={close}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
            {sheetContent}
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

export default CustomBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 150,
  },
});
