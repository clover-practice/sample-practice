module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Other Babel plugins (if any) should be listed before Reanimated
    'react-native-reanimated/plugin',
    
  ],
};
