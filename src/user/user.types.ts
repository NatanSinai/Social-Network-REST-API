import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';

export type User = Prettify<DocumentMetadata & { username: string; password: string; bio: string | null }>;

export type UserDocument = HydratedDocument<User>;

export type CreateUserDTO = Prettify<MakeOptional<Pick<User, '_id' | 'username' | 'password' | 'bio'>, '_id'>>;
export type UpdateUserDTO = Partial<Pick<User, 'username' | 'password' | 'bio'>>;

export type UserCredentials = Pick<User, 'username' | 'password'>;
