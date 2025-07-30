// components/DotLoader.tsx
import React, {useEffect, useRef} from 'react';
import {View, Modal, Animated, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const DOT_COUNT = 8;
const DOT_SIZE = 12;
const RADIUS = 30; // radius of the circular path
const COLOR = '#7B5FFF'; // purple-like color

interface Props {
  visible: boolean;
}

const CustomLoader: React.FC<Props> = ({visible}) => {
  const animations = useRef(
    Array.from({length: DOT_COUNT}, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    const animationsSequence = animations.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    animationsSequence.forEach(anim => anim.start());

    return () => {
      animationsSequence.forEach(anim => anim.stop());
    };
  }, []);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          {Array.from({length: DOT_COUNT}).map((_, i) => {
            const angle = (i * 360) / DOT_COUNT;
            const radians = (angle * Math.PI) / 180;
            const x = RADIUS * Math.cos(radians);
            const y = RADIUS * Math.sin(radians);

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    left: 50 + x,
                    top: 50 + y,
                    opacity: animations[i],
                    transform: [
                      {
                        scale: animations[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export default CustomLoader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLOR,
  },
});
