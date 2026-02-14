import { z } from 'zod';

const envVarSchema = z.object({
  VITE_BACKEND_URL: z.url().default('http://localhost:3000'),
  VITE_GOOGLE_CLIENT_ID: z.string(),
});

export const envVar = envVarSchema.parse(import.meta.env);
