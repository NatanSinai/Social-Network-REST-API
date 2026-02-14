import { ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { UserDocument } from './user.types';

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    postsCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    profilePictureURL: { type: String },
  },
  { timestamps: true, collection: ModelName.USER },
);

const userModel = model<UserDocument>(ModelName.USER, UserSchema);

export default userModel;
