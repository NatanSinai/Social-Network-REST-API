import { ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { UserDocument } from './user.types';

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    postsCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true, collection: ModelName.USER },
);

const userModel = model<UserDocument>(ModelName.USER, UserSchema);

export default userModel;
