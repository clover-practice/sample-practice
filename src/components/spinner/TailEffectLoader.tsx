// components/TailEffectLoader.tsx
import React, {useEffect, useRef} from 'react';
import {View, Modal, Animated, StyleSheet, Easing} from 'react-native';
import Colors from '../../constants/colors';

const DOT_COUNT = 12;
const BASE_SIZE = 6; // smallest dot size
const MAX_SIZE = 14; // leading dot size
const RADIUS = 28;
const COLOR = Colors.PRIMARY; // black

interface Props {
  visible: boolean;
}

const TailEffectLoader: React.FC<Props> = ({visible}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
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
            styles.spinner,
            {
              transform: [{rotate: rotateInterpolation}],
            },
          ]}>
          {Array.from({length: DOT_COUNT}).map((_, i) => {
            const angle = (i * 360) / DOT_COUNT;
            const radians = (angle * Math.PI) / 180;
            const x = RADIUS * Math.cos(radians);
            const y = RADIUS * Math.sin(radians);

            const scaleFactor = 1 - i / DOT_COUNT; // front is 1, back is ~0
            const dotSize = BASE_SIZE + scaleFactor * (MAX_SIZE - BASE_SIZE);

            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    backgroundColor: COLOR,
                    transform: [{translateX: x}, {translateY: y}],
                    opacity: 0.3 + scaleFactor * 0.7,
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

export default TailEffectLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
  },
});
