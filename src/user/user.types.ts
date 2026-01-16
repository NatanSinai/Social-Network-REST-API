import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';

export type User = Prettify<
  DocumentMetadata & {
    username: string;
    password: string;
    email: string;
    isPrivate: boolean;
    postsCount: number;
    bio: string | null;
  }
>;

export type UserDocument = HydratedDocument<User>;

export type CreateUserDTO = MakeOptional<
  Pick<User, '_id' | 'username' | 'email' | 'password' | 'isPrivate' | 'postsCount' | 'bio'>,
  '_id' | 'postsCount'
>;

export type UpdateUserDTO = Partial<Pick<User, 'username' | 'password' | 'email' | 'isPrivate' | 'postsCount' | 'bio'>>;

export type UserCredentials = Pick<User, 'username' | 'password'>;
