import {Platform} from 'react-native';
import {
  useAnimatedScrollHandler,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import type {SharedValue} from 'react-native-reanimated';
import {useCallback} from 'react';

export const useHideTabBarOnScroll = (
  translateY: SharedValue<number>,
  resetOnFocus: boolean = true, // ✅ Optional reset
) => {
  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - prevScrollY.value;

      const hideThreshold = Platform.OS === 'android' ? 5 : 10;
      const showThreshold = 10;

      if (diff > hideThreshold) {
        translateY.value = withTiming(120); // hide tab bar
      } else if (diff < -showThreshold) {
        translateY.value = withTiming(0); // show tab bar
      }

      prevScrollY.value = currentY;
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (resetOnFocus) {
        translateY.value = withTiming(0); // ✅ Always show when screen is focused
      }
    }, [resetOnFocus]),
  );

  return scrollHandler;
};
