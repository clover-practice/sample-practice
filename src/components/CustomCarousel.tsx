import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView as ScrollViewType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PromoBanner from './PromoBanner';

const { width } = Dimensions.get('window');
const AUTO_SCROLL_INTERVAL = 5000;

interface CarouselItem {
  id: string | number;
    uri: any; // use ImageSourcePropType for stricter typing
    titleMessage: string;
}

interface CustomCarouselProps {
  data: CarouselItem[];
}



const CustomCarousel: React.FC<CustomCarouselProps> = ({ data = [] }) => {
  const scrollRef = useRef<ScrollViewType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const scrollToIndex = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = activeIndex + direction;

      if (nextIndex >= data.length) {
        nextIndex = data.length - 2;
        setDirection(-1);
      } else if (nextIndex < 0) {
        nextIndex = 1;
        setDirection(1);
      }

      setActiveIndex(nextIndex);
      scrollToIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [activeIndex, direction, data.length]);

  if (data.length === 0) return null;

  return (
    <View style={styles.carouselWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
              {data.map((item, index) => (
                <PromoBanner
                promoText={ item.titleMessage}
                bannerImage={ item.uri}
                />
           
        ))}
              
          
      </ScrollView>

      <View style={styles.indicatorOverlay}>
        {data.map((_, i) => (
          <Icon
            key={i}
            name="ellipse"
            size={10}
            color={i === activeIndex ? '#000' : '#F2F2F2'}
            style={styles.icon}
          />
        ))}
      </View>
    </View>
  );
};

export default CustomCarousel;

const styles = StyleSheet.create({
  carouselWrapper: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    height: 200,
  },
  imageWrapper: {
    width: width,
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 2,
  },
});
