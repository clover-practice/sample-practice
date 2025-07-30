// ArcLoader.tsx
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const ArcLoader = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.loader,
          {
            transform: [{rotate}],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#007BFF', // Blue arc
    borderRadius: 20, // Half of width/height
  },
});

export default ArcLoader;
