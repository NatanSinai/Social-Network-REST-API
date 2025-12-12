import { HydratedDocument, model, Schema } from 'mongoose';

type PostData = { title: string; content: string; createdAt: Date; updatedAt: Date };
export type PostDocument = HydratedDocument<PostData>;

const PostSchema = new Schema<PostDocument>(
  { title: { type: String, required: true }, content: { type: String, required: true } },
  { timestamps: true },
);

const postModel = model<PostDocument>('Post', PostSchema);

export default postModel;
