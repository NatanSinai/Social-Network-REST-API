import { DocumentMetadataSchema, ObjectIdSchema } from '@/utils/baseSchema';
import type { Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';
import { z } from 'zod';

/* ───────── Entity ───────── */

export const CommentSchema = DocumentMetadataSchema.extend({
  content: z.string(),
  postId: ObjectIdSchema,
  senderId: ObjectIdSchema,
});

/* ───────── DTOs (derived) ───────── */

export const CreateCommentSchema = CommentSchema.pick({
  content: true,
  postId: true,
  senderId: true,
});

export const UpdateCommentSchema = CreateCommentSchema.pick({
  content: true,
}).partial();

/* ───────── Types ───────── */

export type Comment = z.infer<typeof CommentSchema>;
export type CommentDocument = HydratedDocument<Comment>;

export type CreateCommentDTO = Prettify<z.infer<typeof CreateCommentSchema> & Partial<Pick<Comment, '_id'>>>;
export type UpdateCommentDTO = z.infer<typeof UpdateCommentSchema>;
