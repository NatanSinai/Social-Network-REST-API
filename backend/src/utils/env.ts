import { app } from '@/main';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { OBJECT_ID_LENGTH } from './';

const objectIdEnvValidator = (idName: string, defaultValue: string) =>
  z
    .string()
    .length(OBJECT_ID_LENGTH, {
      error: ({ input, minimum }) =>
        `The ${idName} ID must be ${minimum} characters long, because it's a MongoDB ObjectId. You provided in .env file: '${input}'.`,
    })
    .default(defaultValue)
    .refine(isValidObjectId, {
      error: ({ input }) => `The ${idName} ID in .env file '${input}' can't be assigned to a MongoDB ObjectId.`,
    });

const envVarSchema = z.object({
  npm_package_version: z.string().default('1.0.0'), // Generated automatically
  PORT: z.string().default('3000'),
  MONGO_CONNECTION_STRING: z.string().default('mongodb://127.0.0.1:27017/NashDB'),
  EXAMPLE_POST_ID: objectIdEnvValidator('example post', '694582383d983573299dc89b'),
  EXAMPLE_SENDER_ID: objectIdEnvValidator('example sender', '6945824e5cb700d554aa53a0'),
  EXAMPLE_COMMENT_ID: objectIdEnvValidator('example comment', '694582383d983573299dc89c'),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRATION: z.string(),
  JWT_REFRESH_EXPIRATION: z.string(),
  JWT_REFRESH_HASH_SALT_ROUNDS: z.coerce.number(),
  PASSWORD_HASH_SALT_ROUNDS: z.coerce.number(),
  GOOGLE_CLIENT_ID: z.string(),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

export const envVar = envVarSchema.parse(process.env);

export const getNodeEnvironment = () => app.get('env') as 'development' | 'production' | 'test';
