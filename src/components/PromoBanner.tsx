 import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';

interface PromoBannerProps {
  bannerImage: ImageSourcePropType; // Use require(...) for local images
  promoText: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ bannerImage, promoText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={bannerImage} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.promoText} numberOfLines={3} ellipsizeMode="tail">
          {promoText}
        </Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: width - 20,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    flex: 3, // 60%
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 2, // 40%
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  promoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default PromoBanner;
