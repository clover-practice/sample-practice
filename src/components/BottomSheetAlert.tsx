import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Animated,
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Colors from '../constants/colors';

type Props = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

export type BottomSheetAlertRef = {
  show: (props: Props) => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const BottomSheetAlert = forwardRef<BottomSheetAlertRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const propsRef = useRef<Props>({
    message: '',
    title: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: () => {},
  });

  const slideIn = () => {
    setVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = (callback?: () => void) => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      callback?.();
    });
  };

  useImperativeHandle(ref, () => ({
    show: (props: Props) => {
      propsRef.current = props;
      slideIn();
    },
  }));

  const { title, message, confirmText, cancelText, onConfirm } =
    propsRef.current;

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableWithoutFeedback onPress={() => slideOut()}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => slideOut()}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => slideOut(onConfirm)}
                >
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  container: {
    height: SCREEN_HEIGHT / 2, // Covers half of the screen
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.GRAY_DARK,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: Colors.GRAY,
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  confirmText: {
    color: Colors.WHITE,
    textAlign: 'center',
  },
  cancelText: {
    color: Colors.BLACK,
    textAlign: 'center',
  },
});

export default BottomSheetAlert;



               
{/* <BottomSheetAlert ref={alertRef} />
             
const alertRef = useRef<BottomSheetAlertRef>(null);

  const showAlert= () => {
    alertRef.current?.show({
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      onConfirm: () => console.log('User logged out!'),
    });
  }; */}