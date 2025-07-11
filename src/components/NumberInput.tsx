import React from 'react';
import { View, TextInput, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';

type MobileNumberInputProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLength?: number;
  prefix?: string; // e.g., '+91'
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
};

const MobileNumberInput: React.FC<MobileNumberInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter mobile number',
  maxLength = 10,
  prefix,
  containerStyle,
  inputStyle,
}) => {
  const handleChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= maxLength) {
      onChange(numericText);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {prefix && <Text style={styles.prefix}>{prefix}</Text>}
      <TextInput
        style={[styles.input, inputStyle]}
        keyboardType="phone-pad"
        maxLength={maxLength}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
      />
    </View>
  );
};

export default MobileNumberInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  prefix: {
    marginRight: 6,
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
