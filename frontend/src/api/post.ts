import { backendAPI } from '@/api/api';
import type { Post } from '@entities';
import { entries } from 'lodash';

export const POSTS_BASE_API = '/posts';

type WithPostImage<T = unknown> = T & { image?: File | string | null };

export type PaginatedPosts = { posts: Post[]; total: number; page: number; pages: number };

export const getPosts = async (page: number, limit: number) => {
  const { data: posts } = await backendAPI.get<PaginatedPosts>(POSTS_BASE_API, { params: { page, limit } });

  return posts;
};

export const getPostsBySenderId = async (senderId: string, page: number, limit: number) => {
  const { data: posts } = await backendAPI.get<PaginatedPosts>(`${POSTS_BASE_API}`, {
    params: { sender: senderId, page, limit },
  });

  return posts;
};

export type CreatePostDTO = WithPostImage<Pick<Post, 'title' | 'content'>>;
export type UpdatePostDTO = Partial<CreatePostDTO>;

export const createPost = (createPostDTO: CreatePostDTO) => {
  const formData = new FormData();

  entries(createPostDTO).forEach(([key, value]) => (value ? formData.append(key, value) : undefined));

  return backendAPI.post<Post>(POSTS_BASE_API, formData);
};

export const editPost = async ({ id: postId, image, ...createPostDTO }: CreatePostDTO & Pick<Post, 'id'>) => {
  const formData = new FormData();

  entries(createPostDTO).forEach(([key, value]) => (value ? formData.append(key, value) : undefined));

  if (image) formData.set('image', image);
  else formData.set('isDeleteImage', 'true');

  return backendAPI.put<Post>(`${POSTS_BASE_API}/${postId}`, formData);
};

export const deletePost = ({ id: postId }: Pick<Post, 'id'>) => {
  return backendAPI.delete<Post>(`${POSTS_BASE_API}/${postId}`);
};

export const toggleLikePost = (postId: string) => backendAPI.put<Post>(`${POSTS_BASE_API}/${postId}/like`);
