import { model, Schema, type HydratedDocument } from 'mongoose';

type UserData = { name: string; bio: string; createdAt: Date; updatedAt: Date };
export type UserDocument = HydratedDocument<UserData>;

const UserSchema = new Schema<UserDocument>(
  { name: { type: String, required: true }, bio: { type: String, required: true } },
  { timestamps: true },
);

const userModel = model<UserDocument>('User', UserSchema);

export default userModel;
