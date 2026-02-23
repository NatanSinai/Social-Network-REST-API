import type { Post, User } from '@entities';

export const queryKeys = {
  posts: {
    all: (filters?: { page?: number }) => (filters ? ['posts', filters] : ['posts']),
    sender: (senderId: Post['author']['id'], filters?: { page?: number }) => [
      'posts',
      'sender',
      senderId,
      filters ?? {},
    ],
  },
  users: {
    specific: (id: User['id']) => ['users', id],
  },
  comments: {
    byPostId: (postId: Post['id']) => ['comments', 'post', postId],
  },
};
