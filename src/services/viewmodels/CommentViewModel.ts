// src/viewmodels/CommentViewModel.ts
import {useEffect, useState} from 'react';
import {fetchCommentsByPostId} from '../api/endpoints';
import {CommentModel} from '../models/CommentModel';

export const useCommentViewModel = (postId: number) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCommentsByPostId(postId);
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  return {comments, loading, error, reload: loadComments};
};
