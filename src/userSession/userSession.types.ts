import type { DocumentMetadata, Prettify } from '@utils';
import type { HydratedDocument, Types } from 'mongoose';

export type UserSession = Prettify<
  DocumentMetadata & { userId: Types.ObjectId; tokenHash?: string; ip: string | undefined; expiresAt?: Date }
>;

export type UserSessionDocument = HydratedDocument<UserSession>;

export type CreateUserSessionDTO = Pick<UserSession, 'userId' | 'ip'>;

export type UpdateUserSessionDTO = { refreshToken: string };
