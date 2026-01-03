import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument, ObjectId } from 'mongoose';

export type Post = Prettify<{ title: string; content: string; senderId: ObjectId } & DocumentMetadata>;
export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = MakeOptional<Pick<Post, '_id' | 'title' | 'content' | 'senderId'>, '_id'>;
export type UpdatePostDTO = Partial<Pick<Post, 'title' | 'content'>>;
