import { z } from 'zod';
import { userSchema } from './user';

export const postSchema = z.object({
  id: z.uuid({ message: 'Post ID must be a valid UUID' }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters long' }),
  imageURL: z.url({ message: 'Image URL must be a valid URL' }),
  commentsAmount: z
    .int({ message: 'Comments amount must be an integer' })
    .nonnegative({ message: 'Comments amount cannot be negative' }),
  createdAt: z.coerce.date({ error: 'CreatedAt must be a valid date' }),
  updatedAt: z.coerce.date({ error: 'UpdatedAt must be a valid date' }),
  author: userSchema,
});

export type Post = z.infer<typeof postSchema>;

export const postFormSchema = postSchema.pick({ title: true, content: true, imageURL: true });
export type PostFormValues = z.infer<typeof postFormSchema>;
