import React from 'react';
import { Button, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SettingsScreen = () => {
  const { toggleTheme, mode } = useTheme();

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
        onPress={toggleTheme}
      />
    </View>
  );
};

export default SettingsScreen;
