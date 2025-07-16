// responsive.ts
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale horizontally based on screen width
 */
const scaleSize = (size: number): number => (width / BASE_WIDTH) * size;

/**
 * Scale vertically based on screen height
 */
const verticalScaleSize = (size: number): number => (height / BASE_HEIGHT) * size;

/**
 * Responsive font size based on min scale factor
 */
const responsiveFontSize = (size: number): number => {
  const scaleFactor = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
  return Math.round(size * scaleFactor);
};

/**
 * Typed responsive utility object
 */
const responsive = {
  width: (size: number): number => scaleSize(size),
  height: (size: number): number => verticalScaleSize(size),
  fontSize: (size: number): number => responsiveFontSize(size),
  margin: (size: number): number => scaleSize(size),
  padding: (size: number): number => scaleSize(size),
  borderRadius: (size: number): number => scaleSize(size),
};

export default responsive;
