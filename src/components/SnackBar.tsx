import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Easing,
} from 'react-native';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  duration?: number; // auto-hide duration in ms
};

const BottomAlert: React.FC<Props> = ({ visible, message, onDismiss, duration = 3000 }) => {
  const slideAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timeout);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Text style={styles.dismiss}>Dismiss</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    width: width,
    backgroundColor: Colors.PRIMARY,
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
  },
  message: {
    color: Colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  dismiss: {
    color: Colors.WHITE,
    fontWeight: '600',
    marginTop: 8,
  },
});

export default BottomAlert;

// const [showAlert, setShowAlert] = useState(false);

//  <BottomAlert
//         visible={showAlert}
//         message="Action completed successfully!"
//         onDismiss={() => setShowAlert(false)}
//       />