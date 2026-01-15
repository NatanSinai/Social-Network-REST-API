import { DocumentMetadataSchema, ObjectIdSchema } from '@/utils/baseSchema';
import type { Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';
import { z } from 'zod';

/* ───────── Entity ───────── */

export const PostSchema = DocumentMetadataSchema.extend({
  title: z.string(),
  content: z.string(),
  senderId: ObjectIdSchema,
});

/* ───────── DTOs (derived) ───────── */

export const CreatePostSchema = PostSchema.pick({
  title: true,
  content: true,
  senderId: true,
});

export const UpdatePostSchema = CreatePostSchema.partial();

/* ───────── Types ───────── */

export type Post = z.infer<typeof PostSchema>;
export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = Prettify<z.infer<typeof CreatePostSchema> & Partial<Pick<Post, '_id'>>>;
export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;
