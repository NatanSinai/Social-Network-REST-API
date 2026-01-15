import { DocumentMetadataSchema } from '@/utils/baseSchema';
import type { Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';
import { z } from 'zod';

/* ───────── Entity ───────── */

export const UserSchema = DocumentMetadataSchema.extend({
  username: z.string(),
  password: z.string(),
  email: z.email(),
  isPrivate: z.boolean(),
  postsCount: z.number(),
  bio: z.string().nullable(),
});

/* ───────── DTOs (derived) ───────── */

export const CreateUserSchema = UserSchema.pick({
  username: true,
  password: true,
  email: true,
  isPrivate: true,
  bio: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

export const UserCredentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

/* ───────── Safe response ───────── */

export const UserResponseSchema = UserSchema.omit({
  password: true,
});

/* ───────── Types ───────── */

export type User = z.infer<typeof UserSchema>;
export type UserDocument = HydratedDocument<User>;

export type CreateUserDTO = Prettify<z.infer<typeof CreateUserSchema> & Partial<Pick<User, '_id' | 'postsCount'>>>;
export type UpdateUserDTO = Prettify<z.infer<typeof UpdateUserSchema> & Partial<Pick<User, 'postsCount'>>>;
export type UserCredentials = z.infer<typeof UserCredentialsSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
