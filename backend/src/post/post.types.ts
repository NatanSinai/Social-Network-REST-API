import type { User } from '@user/user.types';
import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type Post = Prettify<
  DocumentMetadata & { title: string; content: string; senderId: Types.ObjectId; imageURL: string | null }
>;

export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = MakeOptional<Pick<Post, '_id' | 'title' | 'content' | 'senderId' | 'imageURL'>, '_id'>;
export type UpdatePostDTO = Partial<Pick<Post, 'title' | 'content' | 'senderId' | 'imageURL'>>;

export type PostWithSender = Omit<Post, 'senderId'> & { senderId: User };

export type ParsedPost = Pick<Post, 'title' | 'content' | 'imageURL' | 'createdAt' | 'updatedAt'> & {
  id: string;
  commentsAmount: number;
  author: Pick<User, 'username' | 'profilePictureURL'> & { id: string };
};
