import type { DocumentMetadata, Prettify } from '@utils';
import type { HydratedDocument, ObjectId } from 'mongoose';

export type Post = Prettify<{ title: string; content: string; senderId: ObjectId } & DocumentMetadata>;
export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = Pick<Post, 'title' | 'content' | 'senderId'>;
export type UpdatePostDTO = Pick<Post, '_id' | 'title' | 'content'>;
