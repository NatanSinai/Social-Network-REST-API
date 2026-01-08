import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type Post = Prettify<DocumentMetadata & { title: string; content: string; senderId: Types.ObjectId }>;
export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = MakeOptional<Pick<Post, '_id' | 'title' | 'content' | 'senderId'>, '_id'>;
export type UpdatePostDTO = Partial<Pick<Post, 'title' | 'content'>>;
