import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import CountryPicker from './CountryPicker';
import countries from '../data/countries';
import Colors from '../constants/colors';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const MobileNumberInputProps: React.FC<Props> = ({value, onChange}) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, '');

    // Limit to 10 digits
    if (digitsOnly.length <= 10) {
      onChange(digitsOnly); // call parent with sanitized input
    }

    // Basic validation
    if (digitsOnly.length > 0 && digitsOnly.length < 10) {
      setError('Mobile number must be 10 digits');
    } else {
      setError('');
    }
  };

  return (
    <View style={{width: '100%'}}>
      <View style={styles.container}>
        <CountryPicker
          selected={selectedCountry}
          onSelect={setSelectedCountry}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
          maxLength={10}
          value={value}
          onChangeText={handleChange}
        />
      </View>
      {/* {error ? <Text style={styles.error}>{error}</Text> : null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  error: {
    color: 'red',
    marginTop: 4,
    marginLeft: 12,
    fontSize: 13,
  },
});

export default MobileNumberInputProps;
