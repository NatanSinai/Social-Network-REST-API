import type { User } from '@user/user.types';
import type { Document } from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: User['_id'];
    authCookies: { refreshToken?: string };
  }
}

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ConvertKeysToType<T, Keys extends keyof T, Type> = Prettify<{
  [Key in keyof T]: Key extends Keys ? Type : T[Key];
}>;

export type DocumentMetadata = Pick<Document, '_id'> & { createdAt: Date; updatedAt: Date };

export type MakeOrUndefined<T, Keys extends keyof T> = {
  [Key in keyof T]: Key extends Keys ? T[Key] | undefined : T[Key];
};

export type MakeAllOrUndefined<T> = MakeOrUndefined<T, keyof T>;

export type MakeOptional<T, Keys extends keyof T> = Omit<T, Keys> & {
  [Key in Keys]?: T[Key];
};

export type MakeAllOptional<T> = MakeOptional<T, keyof T>;
