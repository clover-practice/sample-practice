// src/viewmodels/PostViewModel.ts
import {useState, useEffect} from 'react';
import {Post} from '../models/PostModel';
import {fetchPosts} from '../api/endpoints';

export const usePostViewModel = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return {posts, loading, error, reload: loadPosts};
};
