import type { DocumentMetadata, Prettify } from '@utils';
import type { HydratedDocument } from 'mongoose';

export type User = Prettify<{ name: string; bio: string | null } & DocumentMetadata>;
export type UserDocument = HydratedDocument<User>;
