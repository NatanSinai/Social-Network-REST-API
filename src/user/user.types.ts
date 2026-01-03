import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';

export type User = Prettify<{ name: string; bio: string | null } & DocumentMetadata>;
export type UserDocument = HydratedDocument<User>;

export type CreateUserDTO = MakeOptional<Pick<User, '_id' | 'name' | 'bio'>, '_id'>;
export type UpdateUserDTO = Partial<Pick<User, 'name' | 'bio'>>;
