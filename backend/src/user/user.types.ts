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
    profilePictureURL: string | null;
  }
>;

export type UserDocument = HydratedDocument<User>;

export type CreateUserDTO = MakeOptional<
  Pick<User, '_id' | 'username' | 'email' | 'password' | 'isPrivate' | 'postsCount' | 'bio' | 'profilePictureURL'>,
  '_id' | 'postsCount'
>;

export type UpdateUserDTO = Partial<
  Pick<User, 'username' | 'password' | 'email' | 'isPrivate' | 'postsCount' | 'bio' | 'profilePictureURL'>
>;

export type UserCredentials = Pick<User, 'username' | 'password'>;
