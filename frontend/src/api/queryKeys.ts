import type { Post } from '@entities';

export const queryKeys = {
  posts: {
    all: (filters?: { page?: number }) => ['posts', filters ?? {}],
    specific: (id: Post['id']) => ['posts', id],
    sender: (senderId: string, filters?: { page?: number }) => ['posts', 'sender', senderId, filters ?? {}],
  },
  users: {
    specific: (id: string) => ['users', id],
  },
  comments: {
    byPostId: (postId: string) => ['comments', 'post', postId],
  },
};
