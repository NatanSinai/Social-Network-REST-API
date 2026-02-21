import { z } from 'zod';

export const imageFileSchema = z
  .file('Not a file')
  .optional()
  .refine((file) => file instanceof File, 'Image is required')
  .refine((file) => !file || file.type.startsWith('image/'), 'File must be an image');

export const imageURLSchema = z.string('Not a string').optional();

export const imageSchema = z.union([imageFileSchema, imageURLSchema]);

export const metadataSchema = z.object({
  id: z.uuid({ message: 'id must be a valid UUID' }),
  createdAt: z.coerce.date({ error: 'createdAt must be a valid date' }),
  updatedAt: z.coerce.date({ error: 'updatedAt must be a valid date' }),
});
