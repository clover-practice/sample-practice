import React, {useEffect, useRef, useState, forwardRef, useImperativeHandle} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholderList?: string[];
};

const SearchBar = forwardRef<{blur: () => void}, SearchBarProps>(({
  value,
  onChangeText,
  placeholderList = [
    'Search for salons near you', 
    'Try haircut & Spa', 
  ],
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState(placeholderList[0]);
  const placeholderIndex = useRef(0);
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    blur: () => inputRef.current?.blur(),
  }));

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const cyclePlaceholder = () => {
    placeholderIndex.current =
      (placeholderIndex.current + 1) % placeholderList.length;
    setPlaceholderText(placeholderList[placeholderIndex.current]);
  };

  useEffect(() => {
    if (isFocused || value.length > 0) return; // pause when typing

    const id = setInterval(() => {
      // animate out
      translateY.value = withTiming(-8, {duration: 250});
      opacity.value = withTiming(0, {duration: 250}, finished => {
        if (finished) {
          runOnJS(cyclePlaceholder)(); // update text

          // reset + animate in
          translateY.value = 8;
          opacity.value = 0;
          translateY.value = withTiming(0, {duration: 250});
          opacity.value = withTiming(1, {duration: 250});
        }
      });
    }, 2500);

    return () => clearInterval(id);
  }, [isFocused, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return (
    <View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#999" />
      <View style={styles.placeholderWrapper}>
        {value.length === 0 && (
          <Animated.Text style={[styles.animatedPlaceholder, animatedStyle]}>
            {placeholderText}
          </Animated.Text>
        )}
        <TextInput
          ref={inputRef}
          style={styles.inputOverlay}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" " // keeps space for overlay
          cursorColor="#333"
        />
      </View>
    </View>
  );
});

export default SearchBar;

const SKELETON_BG = '#e8e8e8';

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: SKELETON_BG,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    elevation: 1,
  },
  placeholderWrapper: {flex: 1, justifyContent: 'center', height: 40},
  animatedPlaceholder: {
    position: 'absolute',
    left: 8,
    color: '#999',
    fontSize: 16,
  },
  inputOverlay: {
    height: 40,
    fontSize: 16,
    color: '#000',
    paddingLeft: 8,
    backgroundColor: 'transparent',
  },
});
