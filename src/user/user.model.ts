import { ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { UserDocument } from './user.types';

const UserSchema = new Schema<UserDocument>(
  { name: { type: String, required: true }, bio: { type: String } },
  { timestamps: true },
);

const userModel = model<UserDocument>(ModelName.USER, UserSchema);

export default userModel;
