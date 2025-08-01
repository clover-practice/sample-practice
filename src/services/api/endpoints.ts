import {CommentModel} from '../models/CommentModel';
import {Post} from '../models/PostModel';
import {apiClient} from './apiClient';

// src/api/endpoints.ts
const APP_ID = 'your-app-id-here';

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts');
  return response.data;
};

export const fetchCommentsByPostId = async (
  postId: number,
): Promise<CommentModel[]> => {
  const response = await apiClient.get<CommentModel[]>(
    `/posts/${postId}/comments`,
  );
  return response.data;
};
