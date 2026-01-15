import { DocumentMetadataSchema, ObjectIdSchema } from '@utils';
import type { HydratedDocument } from 'mongoose';
import { z } from 'zod';

/* ───────── Entity ───────── */

export const UserSessionSchema = DocumentMetadataSchema.extend({
  userId: ObjectIdSchema,
  tokenHash: z.string().optional(),
  ipAddress: z.string().optional(),
  expiresAt: z.date().optional(),
});

/* ───────── DTOs ───────── */

export const CreateUserSessionSchema = UserSessionSchema.pick({
  userId: true,
  ipAddress: true,
});

export const UpdateUserSessionSchema = z.object({
  refreshToken: z.string(),
});

/* ───────── Types ───────── */

export type UserSession = z.infer<typeof UserSessionSchema>;
export type UserSessionDocument = HydratedDocument<UserSession>;

export type CreateUserSessionDTO = z.infer<typeof CreateUserSessionSchema>;
export type UpdateUserSessionDTO = z.infer<typeof UpdateUserSessionSchema>;
