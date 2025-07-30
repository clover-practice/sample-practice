// components/TailSpinnerLoader.tsx
import React, {useEffect, useRef} from 'react';
import {View, Modal, Animated, StyleSheet, Easing} from 'react-native';

const DOT_COUNT = 12;
const DOT_SIZE = 10;
const RADIUS = 30;
const COLOR = '#00A693'; // teal green

interface Props {
  visible: boolean;
}

const TailSpinnerLoader: React.FC<Props> = ({visible}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();

    return () => spin.stop();
  }, []);

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              transform: [{rotate: rotateInterpolation}],
            },
          ]}>
          {Array.from({length: DOT_COUNT}).map((_, i) => {
            const angle = (i * 360) / DOT_COUNT;
            const radians = (angle * Math.PI) / 180;
            const x = RADIUS * Math.cos(radians);
            const y = RADIUS * Math.sin(radians);
            const opacity = 1 - i / DOT_COUNT;

            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity,
                    backgroundColor: COLOR,
                    transform: [{translateX: x}, {translateY: y}],
                  },
                ]}
              />
            );
          })}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default TailSpinnerLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    width: 2 * RADIUS + DOT_SIZE,
    height: 2 * RADIUS + DOT_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
