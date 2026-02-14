import { z } from 'zod';

export const userSchema = z.object({
  id: z.uuid({ message: 'User ID must be a valid UUID' }),
  username: z.string().min(1, { message: 'User name is required' }),
  profilePictureURL: z.url({ message: 'User profile picture must be a valid URL' }),
});

export type User = z.infer<typeof userSchema>;
