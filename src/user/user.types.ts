import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';

export type User = Prettify<
  { name: string; email: string; isPrivate: boolean; postsCount: number; bio: string | null } & DocumentMetadata
>;
export type UserDocument = HydratedDocument<User>;

export type CreateUserDTO = MakeOptional<
  Pick<User, '_id' | 'name' | 'email' | 'isPrivate' | 'postsCount' | 'bio'>,
  '_id'
>;
export type UpdateUserDTO = Partial<Pick<User, 'name' | 'email' | 'isPrivate' | 'postsCount' | 'bio'>>;
