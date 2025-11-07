import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('window');

interface SlideData {
  title: string;
  subtitle: string;
  imageUrl?: string;
  highlightWords?: string[];
}

interface BottomAlertProps {
  visible: boolean;
  data: SlideData[];
  autoScrollInterval?: number;
  onFinish?: () => void;
  onCancel?: () => void;
}

const BottomAlert: React.FC<BottomAlertProps> = ({
  visible,
  data,
  autoScrollInterval = 3000,
  onFinish,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = data[currentIndex];
  const isLastSlide = currentIndex === data.length - 1;

  useEffect(() => {
    if (!visible || data.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev === data.length - 1) {
          return prev; // Stop at last slide
        }
        return prev + 1;
      });
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [visible, data.length, autoScrollInterval]);

  const handleNext = () => {
    if (isLastSlide) {
      onFinish?.();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!currentSlide) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.imageSection}>
            <Image
              // source={currentSlide.imageUrl ? {uri: currentSlide.imageUrl} : require('../assets/images/home_page_alert.png')}

              source={require('../assets/images/home_page_alert.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.title}>
              {currentSlide.title.split(' ').map((word, i) => {
                const shouldHighlight = currentSlide.highlightWords?.some(hw =>
                  word.toLowerCase().includes(hw.toLowerCase()),
                );
                if (shouldHighlight) {
                  return (
                    <Text key={i} style={styles.highlight}>
                      {word + ' '}
                    </Text>
                  );
                }
                return word + ' ';
              })}
            </Text>

            <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

            <View style={styles.indicatorContainer}>
              {data.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.indicator,
                    i === currentIndex
                      ? styles.activeIndicator
                      : styles.inactiveIndicator,
                  ]}
                />
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}>
                <Text style={styles.primaryText}>
                  {isLastSlide ? 'Get Started' : 'Next'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BottomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.85,
    backgroundColor: '#1E3A8A',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  imageSection: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  image: {
    width: width * 0.7,
    height: height * 0.35,
  },
  contentSection: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 50,
    minHeight: height * 0.4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  highlight: {
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  indicator: {
    width: 32,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: '#2563EB',
  },
  inactiveIndicator: {
    backgroundColor: '#E5E7EB',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: width * 0.8,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  primaryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
