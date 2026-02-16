import { z } from 'zod';

export const imageSchema = z
  .file()
  .optional()
  .refine((file) => file instanceof File, 'Image is required')
  .refine((file) => !file || file.type.startsWith('image/'), 'File must be an image');

export const metadataSchema = z.object({
  id: z.uuid({ message: 'id must be a valid UUID' }),
  createdAt: z.coerce.date({ error: 'createdAt must be a valid date' }),
  updatedAt: z.coerce.date({ error: 'updatedAt must be a valid date' }),
});
