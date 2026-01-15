import type { DocumentMetadata, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type UserSession = Prettify<
  DocumentMetadata & { userId: Types.ObjectId; tokenHash?: string; ipAddress: string | undefined; expiresAt?: Date }
>;

export type UserSessionDocument = HydratedDocument<UserSession>;

export type CreateUserSessionDTO = Pick<UserSession, 'userId' | 'ipAddress'>;

export type UpdateUserSessionDTO = { refreshToken: string };
