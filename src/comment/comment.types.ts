import type { DocumentMetadata, Prettify } from '@utils';
import type { HydratedDocument, ObjectId } from 'mongoose';

export type Comment = Prettify<{ content: string; postId: ObjectId; senderId: ObjectId } & DocumentMetadata>;
export type CommentDocument = HydratedDocument<Comment>;

export type CreateCommentDTO = Pick<Comment, 'content' | 'postId' | 'senderId'>;
export type UpdateCommentDTO = Partial<Pick<Comment, 'content'>>;
