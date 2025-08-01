// CircularArcLoader.tsx
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

interface Props {
  visible: boolean;
}

const CircularArcLoader: React.FC<Props> = ({visible}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1000,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      cancelAnimation(rotation);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
    opacity: visible ? 1 : 0, // Hide when false
  }));

  return (
    <AnimatedView style={[styles.loaderContainer, animatedStyle]}>
      <View style={styles.arc} />
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arc: {
    width: 30,
    height: 30,
    borderWidth: 5,
    borderRadius: 15,
    borderTopColor: '#2196F3',
    borderRightColor: '#2196F3',
    borderBottomColor: '#2196F3',
    borderLeftColor: 'transparent',
  },
});

export default CircularArcLoader;
