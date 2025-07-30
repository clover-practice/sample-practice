import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  icon?: string; // Left-side icon (optional)
  error?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  keyboardType?: TextInputProps['keyboardType'];
}

const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  icon,
  error,
  isPassword = false,
  containerStyle,
  inputStyle,
  keyboardType = 'default',
  ...rest
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  const toggleSecure = () => setIsSecure(prev => !prev);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {icon ? (
          <Icon name={icon} size={20} color="#888" style={styles.leftIcon} />
        ) : null}

        <TextInput
          style={[styles.input, inputStyle]}
          secureTextEntry={isSecure}
          placeholderTextColor="#888" 
          keyboardType={keyboardType}
          {...rest}
        />

        {isPassword && (
          <TouchableOpacity onPress={toggleSecure}>
            <Icon
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#888"
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#e63946',
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AppTextInput;
