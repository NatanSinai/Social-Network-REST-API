import { metadataSchema } from '@/utils/zod';
import { z } from 'zod';
import { userSchema } from './user';

export const postSchema = metadataSchema.extend({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long' }),
  imageURL: z.url({ message: 'Image URL must be a valid URL' }),
  commentsAmount: z
    .int({ message: 'Comments amount must be an integer' })
    .nonnegative({ message: 'Comments amount cannot be negative' }),
  author: userSchema,
});

export type Post = z.infer<typeof postSchema>;
