import { Types } from 'mongoose';
import { z } from 'zod';

export enum ModelName {
  USER = 'user',
  POST = 'post',
  COMMENT = 'comment',
  USER_SESSION = 'userSession',
}

export const OBJECT_ID_LENGTH = 24;

export enum CookieName {
  REFRESH_TOKEN = 'refreshToken',
}

export enum NoAuthorizationReason {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNAUTHORIZED_TO_ACCESS_ROUTE = 'UNAUTHORIZED_TO_ACCESS_ROUTE',
  NO_TOKEN = 'NO_TOKEN',
  NO_SESSION = 'NO_SESSION',
  GOOGLE_TOKEN_INVALID = 'GOOGLE_TOKEN_INVALID',
}

export const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), 'Invalid ObjectId')
  .transform((val) => new Types.ObjectId(val));
