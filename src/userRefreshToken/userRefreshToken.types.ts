import type { DocumentMetadata, MakeOptional, Prettify } from '@utils';
import type { HydratedDocument, ObjectId } from 'mongoose';

export type UserRefreshToken = Prettify<
  { userId: ObjectId; refreshToken: string } & Omit<DocumentMetadata, 'updatedAt'>
>;

export type UserRefreshTokenDocument = HydratedDocument<UserRefreshToken>;

export type CreateUserRefreshTokenDTO = MakeOptional<Omit<UserRefreshToken, 'createdAt'>, '_id'>;

export type UpdateUserRefreshTokenDTO = Partial<Pick<UserRefreshToken, 'refreshToken'>>;
