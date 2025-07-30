// DottedLoader.tsx
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';

const DOT_COUNT = 12;
const RADIUS = 30;
const DOT_SIZE = 8;

const DottedLoader = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const dots = Array.from({length: DOT_COUNT}).map((_, index) => {
    const angle = (2 * Math.PI * index) / DOT_COUNT;
    const x = RADIUS * Math.cos(angle);
    const y = RADIUS * Math.sin(angle);

    return (
      <View
        key={index}
        style={[
          styles.dot,
          {
            top: 40 + y,
            left: 40 + x,
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.spinner, {transform: [{rotate: rotateInterpolate}]}]}>
        {dots}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 80,
    height: 80,
    position: 'absolute',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#007BFF',
    position: 'absolute',
  },
});

export default DottedLoader;
