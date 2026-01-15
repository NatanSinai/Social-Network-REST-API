import type { Types } from 'mongoose';
import { z } from 'zod';

export const ObjectIdSchema = z.custom<Types.ObjectId>(() => z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId'));

export const DocumentMetadataSchema = z.object({ _id: ObjectIdSchema, createdAt: z.date(), updatedAt: z.date() });
