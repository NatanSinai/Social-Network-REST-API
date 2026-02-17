import type { Post } from '@entities';

export const queryKeys = {
  posts: {
    all: (filters?: { page?: number }) => ['posts', filters ?? {}],
    specific: (id: Post['id']) => ['posts', id],
  },
};
