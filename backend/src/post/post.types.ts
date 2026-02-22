import type { User } from '@user/user.types';
import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type Post = Prettify<
  DocumentMetadata & {
    title: string;
    content: string;
    senderId: Types.ObjectId;
    imageURL: string | null;
    likes: Types.ObjectId[];
  }
>;

export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = MakeOptional<
  Pick<Post, '_id' | 'title' | 'content' | 'senderId' | 'imageURL' | 'likes'>,
  '_id' | 'imageURL' | 'likes'
>;

export type UpdatePostDTO = Partial<
  Pick<Post, 'title' | 'content' | 'senderId' | 'imageURL' | 'likes'> & { isDeleteImage: 'true' | undefined }
>;

export type PostWithSender = Omit<Post, 'senderId'> & { senderId: User; commentsAmount: number };

export type ParsedPost = Pick<Post, 'title' | 'content' | 'imageURL' | 'createdAt' | 'updatedAt'> & {
  id: string;
  commentsAmount: number;
  likesAmount: number;
  isLiked: boolean;
  author: Pick<User, 'username' | 'profilePictureURL'> & { id: string };
};
