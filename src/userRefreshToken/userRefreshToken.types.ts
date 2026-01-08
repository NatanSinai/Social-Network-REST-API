import type { DocumentMetadata, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type UserRefreshToken = Prettify<
  { userId: Types.ObjectId; refreshToken: string } & Omit<DocumentMetadata, 'updatedAt'>
>;

export type UserRefreshTokenDocument = HydratedDocument<UserRefreshToken>;

export type CreateUserRefreshTokenDTO = Pick<UserRefreshToken, 'userId' | 'refreshToken'>;

export type UpdateUserRefreshTokenDTO = Partial<Pick<UserRefreshToken, 'refreshToken'>>;
