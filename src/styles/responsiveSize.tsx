import {Dimensions, Platform, StatusBar} from 'react-native';

// Get device dimensions
const {width, height} = Dimensions.get('window');

// Device orientation constants
const LANDSCAPE = 'landscape';
const PORTRAIT = 'portrait';

// iPhone X & XS Max screen dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

// Base guideline sizes (based on standard ~5" screen)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Device-specific dimensions
const sliderWidth = width - 20;
const itemWidth = width - 20;

// Check if device is iPhone X or XS Max
const isIPhoneX = (): boolean =>
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTV &&
  ((width === X_WIDTH && height === X_HEIGHT) ||
    (width === XSMAX_WIDTH && height === XSMAX_HEIGHT));

// Status bar height with hardcoded fallback for Android
const StatusBarHeight: number | undefined = Platform.select({
  ios: isIPhoneX() ? 44 : 44,
  android: 44,
  default: 0,
});

// More accurate status bar height (non-customized)
const StatusBarHeightSecond: number | undefined = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

// Responsive size scaling functions
const scale = (size: number): number => (width / guidelineBaseWidth) * size;

const verticalScale = (size: number): number =>
  (height / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

const moderateScaleVertical = (size: number, factor: number = 0.5): number =>
  size + (verticalScale(size) - size) * factor;

const textScale = (percent: number): number => {
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const ratio = screenHeight / screenWidth;

  const deviceHeight = screenHeight * (ratio > 1.8 ? 0.14 : 0.15); // ratio > 1.8 indicates taller devices

  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
};

// Export everything
export {
  scale,
  verticalScale,
  textScale,
  moderateScale,
  moderateScaleVertical,
  width,
  height,
  sliderWidth,
  itemWidth,
  StatusBarHeight,
  StatusBarHeightSecond,
  isIPhoneX,
  LANDSCAPE,
  PORTRAIT,
};

// import {Dimensions, Platform, StatusBar} from 'react-native';
// const {width, height} = Dimensions.get('window');

// const LANDSCAPE = 'landscape';
// const PORTRAIT = 'portrait';

// const X_WIDTH = 375;
// const X_HEIGHT = 812;

// const XSMAX_WIDTH = 414;
// const XSMAX_HEIGHT = 896;

// const guidelineBaseWidth = 375;
// const guidelineBaseHeight = 812;

// const sliderWidth = width - 20;
// const itemWidth = width - 20;

// const isIPhoneX = () =>
//   Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV
//     ? (width === X_WIDTH && height === X_HEIGHT) ||
//       (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
//     : false;

// const StatusBarHeight = Platform.select({
//   ios: isIPhoneX() ? 44 : 44,
//   // android: StatusBar.currentHeight,
//   android: 44,
//   default: 0,
// });

// //Non customised
// const StatusBarHeightSecond = Platform.select({
//   ios: isIPhoneX() ? 44 : 20,
//   android: StatusBar.currentHeight,
//   default: 0,
// });

// const scale = size : number=> (width / guidelineBaseWidth) * size;
// const verticalScale = size => (height / guidelineBaseHeight) * size;
// const moderateScale = (size, factor = 0.5) =>
//   size + (scale(size) - size) * factor;
// const moderateScaleVertical = (size, factor = 0.5) =>
//   size + (verticalScale(size) - size) * factor;
// const textScale = percent => {
//   const screenHeight = Dimensions.get('window').height;
//   //calculate absolute ratio for bigger screens 18.5:9 requiring smaller scaling
//   const ratio =
//     Dimensions.get('window').height / Dimensions.get('window').width;
//   //Guideline sizes are based on standard ~5″ screen mobile device
//   const deviceHeight = 375
//     ? screenHeight * (ratio > 1.8 ? 0.14 : 0.15) //Set guideline depending on absolute ratio
//     : Platform.OS === 'android'
//     ? screenHeight - StatusBar.currentHeight
//     : screenHeight;

//   const heightPercent = (percent * deviceHeight) / 100;
//   return Math.round(heightPercent);
// };

// export {
//   scale,
//   verticalScale,
//   textScale,
//   moderateScale,
//   moderateScaleVertical,
//   width,
//   height,
//   sliderWidth,
//   itemWidth,
//   StatusBarHeight,
//   StatusBarHeightSecond,
// };
