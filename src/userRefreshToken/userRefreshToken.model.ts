import { envVar, ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { UserRefreshTokenDocument } from './userRefreshToken.types';

const UserRefreshTokenSchema = new Schema<UserRefreshTokenDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.USER },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: envVar.REFRESH_TOKEN_TTL_IN_SECONDS }, // TODO: put in env
});

const userRefreshTokenModel = model<UserRefreshTokenDocument>(ModelName.USER_REFRESH_TOKEN, UserRefreshTokenSchema);

export default userRefreshTokenModel;
