import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
} from 'react-native';
import {usePostViewModel} from '../services/viewmodels/PostViewModel';
import CustomHeader from '../components/CustomHeader';
import KeyboardAvoidingWrapper from '../utils/KeyboardAvoidingWrapper';
import {goBack} from '../utils/NavigationUtils';
import CircularArcLoader from '../components/spinner/CircularLoaderView';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

const MomentScreen = () => {
  const {posts, loading, error, reload} = usePostViewModel();
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  const placeholderTextList = [
    'Search for salons near you',
    'Try haircut & Spa',
    'Look for trending styles',
    'Find deals around you',
  ];

  const [placeholderText, setPlaceholderText] = useState(
    placeholderTextList[0],
  );
  const placeholderIndex = useRef(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Update placeholder text
  const updatePlaceholder = () => {
    placeholderIndex.current =
      (placeholderIndex.current + 1) % placeholderTextList.length;
    setPlaceholderText(placeholderTextList[placeholderIndex.current]);
  };

  // Animate placeholder every 5s (only when not focused and input is empty)
  useEffect(() => {
    const intervalId = setInterval(() => {
      const shouldAnimate = !isFocused && searchText.length === 0;
      if (shouldAnimate) {
        translateY.value = withTiming(-10, {duration: 300});
        opacity.value = withTiming(0, {duration: 300}, finished => {
          if (finished) {
            runOnJS(updatePlaceholder)();
            translateY.value = 10;
            opacity.value = 0;
            translateY.value = withTiming(0, {duration: 300});
            opacity.value = withTiming(1, {duration: 300});
          }
        });
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [isFocused, searchText]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.safeArea}>
      <CustomHeader
        title="Posts"
        showBack={true}
        onBackPress={() => goBack()}
      />
      <KeyboardAvoidingWrapper containerStyle={styles.containerStyle}>
        {/* Animated Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <View style={styles.placeholderWrapper}>
            {searchText.length === 0 &&
              (isFocused ? (
                <Text style={styles.staticPlaceholder}>{placeholderText}</Text>
              ) : (
                <Animated.Text
                  style={[styles.animatedPlaceholder, animatedStyle]}>
                  {placeholderText}
                </Animated.Text>
              ))}
            <TextInput
              style={styles.inputOverlay}
              value={searchText}
              onChangeText={text => setSearchText(text)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=" " // empty so native placeholder is suppressed
              cursorColor={'#333'}
            />
          </View>
        </View>

        {/* Posts */}
        {loading && posts.length === 0 ? (
          <View style={styles.loaderWrapper}>
            <CircularArcLoader isAnimating={loading} />
          </View>
        ) : error ? (
          <Text style={{color: 'red'}}>{error}</Text>
        ) : (
          <FlatList
            data={posts.filter(post =>
              post.title.toLowerCase().includes(searchText.toLowerCase()),
            )}
            keyExtractor={item => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={reload} />
            }
            renderItem={({item}) => (
              <View style={styles.postItem}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text>{item.body}</Text>
                <Text style={styles.commentLabel}>5 Comments</Text>
              </View>
            )}
          />
        )}
      </KeyboardAvoidingWrapper>
    </View>
  );
};

export default MomentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerStyle: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 12,
    padding: 5,
    borderColor: '#f2f2f2',
    borderWidth: 2,
  },
  placeholderWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  animatedPlaceholder: {
    position: 'absolute',
    left: 8,
    top: 10,
    color: '#999',
    fontSize: 16,
  },
  staticPlaceholder: {
    position: 'absolute',
    left: 8,
    top: 10,
    color: '#999',
    fontSize: 16,
  },
  inputOverlay: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  postItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
    borderColor: '#eee',
  },
  postTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentLabel: {
    fontWeight: 'bold',
    marginTop: 4,
  },
});
