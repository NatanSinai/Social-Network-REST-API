import { metadataSchema } from '@/utils/zod';
import { z } from 'zod';
import { userSchema } from './user';

export const postSchema = metadataSchema.extend({
  title: z
    .string()
    .min(3, { error: ({ minimum }) => `Title must be at least ${minimum} characters long` })
    .max(30, { error: ({ maximum }) => `Title must be maximum ${maximum} characters long` }),
  content: z
    .string()
    .min(3, { error: ({ minimum }) => `Content must be at least ${minimum} characters long` })
    .max(500, { error: ({ maximum }) => `Content must be maximum ${maximum} characters long` }),
  imageURL: z.url({ message: 'Image URL must be a valid URL' }),
  commentsAmount: z
    .int({ message: 'Comments amount must be an integer' })
    .nonnegative({ message: 'Comments amount cannot be negative' }),
  likesAmount: z
    .int({ message: 'Likes amount must be an integer' })
    .nonnegative({ message: 'Likes amount cannot be negative' }),
  isLiked: z.boolean(),
  author: userSchema,
});

export type Post = z.infer<typeof postSchema>;
