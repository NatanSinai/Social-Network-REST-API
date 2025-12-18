import { model, Schema, type HydratedDocument, type ObjectId } from 'mongoose';

type PostData = { title: string; content: string; senderId: ObjectId; createdAt: Date; updatedAt: Date };
export type PostDocument = HydratedDocument<PostData>;

const PostSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true },
);

const postModel = model<PostDocument>('Post', PostSchema);

export default postModel;
