import { z } from 'zod';

const envVarSchema = z.object({
  VITE_BACKEND_URL: z.url().default('http://localhost:3000'),
});

export const envVar = envVarSchema.parse(import.meta.env);
