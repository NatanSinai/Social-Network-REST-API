import type { HydratedDocument } from 'mongoose';

export type Post = { title: string; content: string; createdAt: Date; updatedAt: Date };
export type PostDocument = HydratedDocument<Post>;

export type CreatePostDTO = Pick<Post, 'title' | 'content'>;
export type UpdatePostDTO = CreatePostDTO;
