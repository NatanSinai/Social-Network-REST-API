import { model, Schema } from 'mongoose';
import type { PostDocument } from './post.types';

const PostSchema = new Schema<PostDocument>(
  { title: { type: String, required: true }, content: { type: String, required: true } },
  { timestamps: true },
);

const postModel = model<PostDocument>('Post', PostSchema);

export default postModel;
