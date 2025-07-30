import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
const BAR_WIDTH = width * 0.8;
const BAR_HEIGHT = 16;

interface Props {
  progress: number; // value between 0 and 1
}

const ProgressBarWithPercent: React.FC<Props> = ({progress}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [displayedPercent, setDisplayedPercent] = useState(0);

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 5000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Interpolate bar width
  const widthInterpolated = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH],
  });

  // Listen to animated value and update percentage state
  useEffect(() => {
    const id = animatedProgress.addListener(({value}) => {
      const percentage = Math.round(value * 100);
      setDisplayedPercent(percentage);
    });
    return () => {
      animatedProgress.removeListener(id);
    };
  }, [animatedProgress]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Loading... {displayedPercent}%</Text>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[styles.progressFill, {width: widthInterpolated}]}
        />
      </View>
    </View>
  );
};

export default ProgressBarWithPercent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  progressBackground: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: '#ccc',
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: BAR_HEIGHT,
    backgroundColor: '#007BFF',
    borderRadius: BAR_HEIGHT / 2,
  },
});
