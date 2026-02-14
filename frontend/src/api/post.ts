import { backendAPI } from '@/api/api';
import type { Post } from '@entities';
import { entries } from 'lodash';

export const POSTS_BASE_API = '/posts';

type WithPostImage<T = unknown> = T & { image?: File | null };

export type PaginatedPosts = { posts: Post[]; total: number; page: number; pages: number };

export const getPosts = async (page: number, limit: number) => {
  const { data: posts } = await backendAPI.get<PaginatedPosts>(POSTS_BASE_API, { params: { page, limit } });

  return posts;
};

export type CreatePostDTO = WithPostImage<Pick<Post, 'title' | 'content'>>;
export type UpdatePostDTO = Partial<CreatePostDTO>;

export const createPost = (createPostDTO: CreatePostDTO) => {
  const formData = new FormData();

  const senderId = '';
  formData.append('senderId', senderId);

  entries(createPostDTO).forEach(([key, value]) => (value ? formData.append(key, value) : undefined));

  return backendAPI.post<Post>(POSTS_BASE_API, formData);
};
