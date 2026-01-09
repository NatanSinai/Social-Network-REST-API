import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type Comment = Prettify<
  { content: string; postId: Types.ObjectId; senderId: Types.ObjectId } & DocumentMetadata
>;
export type CommentDocument = HydratedDocument<Comment>;

export type CreateCommentDTO = MakeOptional<Pick<Comment, '_id' | 'content' | 'postId' | 'senderId'>, '_id'>;
export type UpdateCommentDTO = Partial<Pick<Comment, 'content' | 'senderId'>>;
