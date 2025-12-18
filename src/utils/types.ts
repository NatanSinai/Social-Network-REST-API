import type { Document } from 'mongoose';

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type ConvertKeysToType<T, Keys extends keyof T, Type> = Prettify<{
  [Key in keyof T]: Key extends Keys ? Type : T[Key];
}>;

export type DocumentMetadata = Pick<Document, '_id'> & { createdAt: Date; updatedAt: Date };
