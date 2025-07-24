// hooks/useHideTabBarOnScroll.ts
import {Platform} from 'react-native';
import {
  useAnimatedScrollHandler,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import type {SharedValue} from 'react-native-reanimated'; // ✅ Correct type import

export const useHideTabBarOnScroll = (
  translateY: SharedValue<number>, // ✅ Correct type usage
) => {
  const prevScrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - prevScrollY.value;

      const hideThreshold = Platform.OS === 'android' ? 10 : 20;
      const showThreshold = 10;

      if (diff > hideThreshold) {
        translateY.value = withTiming(120); // adjust as needed
      } else if (diff < -showThreshold) {
        translateY.value = withTiming(0);
      }

      prevScrollY.value = currentY;
    },
  });

  return scrollHandler;
};
