import { ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { UserSessionDocument } from './userSession.types';

const UserSessionSchema = new Schema<UserSessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.USER },
    tokenHash: { type: String },
    ip: { type: String },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  },
  { timestamps: true, collection: ModelName.USER_SESSION },
);

const userSessionModel = model<UserSessionDocument>(ModelName.USER_SESSION, UserSessionSchema);

export default userSessionModel;
