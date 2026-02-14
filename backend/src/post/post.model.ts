import { ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { PostDocument } from './post.types';

const PostSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.USER },
    imageURL: { type: String },
  },
  { timestamps: true, collection: ModelName.POST },
);

const postModel = model<PostDocument>(ModelName.POST, PostSchema);

export default postModel;
