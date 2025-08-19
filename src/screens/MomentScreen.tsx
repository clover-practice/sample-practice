import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {usePostViewModel} from '../services/viewmodels/PostViewModel';
import CustomHeader from '../components/CustomHeader';
import {goBack} from '../utils/NavigationUtils';
import CircularArcLoader from '../components/spinner/CircularLoaderView';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from 'react-native-reanimated';
import SearchBar from '../components/SearchBar';

const SkeletonFeed = ({count = 6}: {count?: number}) => {
  const pulse = useSharedValue(0.6);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, {duration: 800}), -1, true);
  }, [pulse]);

  const a = useAnimatedStyle(() => ({opacity: pulse.value}));

  return (
    <View style={{paddingHorizontal: 12, paddingTop: 8}}>
      {Array.from({length: count}).map((_, i) => (
        <View key={i} style={{marginBottom: 16}}>
          {/* big thumbnail placeholder */}
          <Animated.View style={[styles.skelThumb, a]} />
          {/* title lines */}
          <Animated.View style={[styles.skelLine, {width: '80%'}, a]} />
          <Animated.View
            style={[styles.skelLine, {width: '60%', marginTop: 8}, a]}
          />
        </View>
      ))}
    </View>
  );
};

const MomentScreen = () => {
  const {posts = [], loading, error, reload} = usePostViewModel();
  const [searchText, setSearchText] = useState('');
  const searchBarRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        searchBarRef.current?.blur();
      };
    }, [])
  );

  const placeholderTextList = [
    'Search for salons near you',
    'Spa',
    'Try haircut & Spa',
    'Look for trending styles',
    'Find deals around you',
  ];

  const filteredPosts = posts.filter(p =>
    String(p.title ?? '')
      .toLowerCase()
      .includes(searchText.toLowerCase()),
  );

  const renderItem = useCallback(
    ({item}: {item: any}) => (
      <View style={styles.postItem}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody}>{item.body}</Text>
        <Text style={styles.commentLabel}>5 Comments</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.safeArea}>
      <CustomHeader title="Posts" showBack onBackPress={goBack} />

      {/* Search Bar */}
      <SearchBar
        ref={searchBarRef}
        value={searchText}
        onChangeText={setSearchText}
        placeholderList={placeholderTextList}
      />

      {/* Content */}
      {loading && posts.length === 0 ? (
        // YouTube-like skeletons while first load happens
        <SkeletonFeed />
      ) : error ? (
        <Text style={styles.errorText}>{String(error)}</Text>
      ) : filteredPosts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No posts found</Text>
          <Text style={styles.emptySub}>Try a different search</Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatListStyle}
          data={filteredPosts}
          keyExtractor={item => String(item.id ?? Math.random())}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={reload} />
          }
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
        />
      )}

      {/* Subtle loader if list exists and you trigger refresh */}
      {loading && posts.length > 0 && (
        <View style={styles.loaderOverlay}>
          <CircularArcLoader visible />
        </View>
      )}
    </View>
  );
};

export default MomentScreen;

const SKELETON_BG = '#e8e8e8';

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'},
  flatListStyle: {flex: 1, paddingHorizontal: 12},
  flatListContent: {paddingBottom: 100},



  // Post card
  postItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {fontSize: 16, fontWeight: '600', marginBottom: 6, color: '#222'},
  postBody: {fontSize: 14, color: '#555', lineHeight: 20},
  commentLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
    marginTop: 10,
  },

  // Skeleton
  skelThumb: {
    height: 180,
    borderRadius: 12,
    backgroundColor: SKELETON_BG,
    marginBottom: 10,
  },
  skelLine: {
    height: 14,
    borderRadius: 6,
    backgroundColor: SKELETON_BG,
  },

  // States
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#ff4d4f',
    fontWeight: '500',
  },
  emptyWrap: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptyTitle: {fontSize: 16, color: '#222', fontWeight: '600'},
  emptySub: {fontSize: 13, color: '#888', marginTop: 6},

  loaderOverlay: {position: 'absolute', bottom: 20, alignSelf: 'center'},
});
