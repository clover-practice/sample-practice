import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Colors from '../constants/colors';
import Strings from '../constants/Constants';
 

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  showCancelButton?: boolean;
};

const CustomAlert: React.FC<Props> = ({
  visible,
  title,
  message,
  onClose,
  onConfirm,
  cancelText = Strings.CANCEL,
  confirmText = Strings.CONFIRM,
  showCancelButton = true,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {title && <Text style={styles.title}>{title}</Text>}
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {showCancelButton && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                onConfirm?.();
                onClose();
              }}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.TRANSPARENT_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.BLACK,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.GRAY_DARK,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.GRAY_LIGHT,
  },
  confirmButton: {
    backgroundColor: Colors.PRIMARY,
  },
  cancelText: {
    color: Colors.GRAY_DARK,
    fontWeight: '600',
  },
  confirmText: {
    color: Colors.WHITE,
    fontWeight: '600',
  },
});

export default CustomAlert;



// const [visible, setVisible] = useState(false);
//    <CustomAlert
//         visible={visible}
//         title="Confirm Action"
//         message="Are you sure you want to proceed?"
//         onClose={() => setVisible(false)}
//         onConfirm={() => {
//           console.log('Confirmed!');
//         }}
//         showCancelButton={true}
//         cancelText="No"
//         confirmText="Yes"
//       />