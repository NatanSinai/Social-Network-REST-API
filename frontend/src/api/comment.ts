import { backendAPI } from '@/api/api';

export const COMMENTS_BASE_API = '/comments';

export type Comment = {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    profilePictureURL: string | null;
  };
};

export const getCommentsByPostId = async (postId: string) => {
  const { data: comments } = await backendAPI.get<Comment[]>(COMMENTS_BASE_API, {
    params: { postId },
  });

  return comments;
};

export type CreateCommentDTO = {
  content: string;
  postId: string;
};

export const createComment = async (createCommentDTO: CreateCommentDTO) => {
  const { data: comment } = await backendAPI.post<Comment>(COMMENTS_BASE_API, createCommentDTO);

  return comment;
};
