import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';

const {width} = Dimensions.get('window');

interface Props {
  images: any[];
  height?: number;
  duration?: number;
}

const HeaderImageCarousel: React.FC<Props> = ({
  images,
  height = 200,
  duration = 3000,
}) => {
  const scrollRef = useRef<ScrollView>(null);
  const indicatorScrollRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const startProgress = () => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    startProgress();
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({x: nextIndex * width, animated: true});
      setCurrentIndex(nextIndex);
      scrollToActiveIndicator(nextIndex);
      startProgress();
    }, duration);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
      scrollToActiveIndicator(index);
      startProgress();
    }
  };

  const scrollToActiveIndicator = (index: number) => {
    // Auto-scroll indicator to keep active in view
    indicatorScrollRef.current?.scrollTo({
      x: Math.max(0, (index - 2) * 34), // adjust 34 based on each item width + margin
      animated: true,
    });
  };

  return (
    <View>
      {/* Image Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={image}
            style={{width: width, height}}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Scrollable Progress Indicators */}
      <View style={styles.progressContainerWrapper}>
        <ScrollView
          horizontal
          ref={indicatorScrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.progressContainer}>
          {images.map((_, index) => (
            <View key={index} style={styles.progressBarBackground}>
              {index === currentIndex && (
                <Animated.View
                  style={[
                    styles.progressBarActive,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainerWrapper: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  progressBarBackground: {
    width: 30,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 4,
  },
  progressBarActive: {
    height: 4,
    backgroundColor: '#00aaff',
    borderRadius: 2,
  },
});

export default HeaderImageCarousel;
