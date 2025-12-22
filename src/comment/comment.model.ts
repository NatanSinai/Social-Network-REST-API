import { ModelName } from '@utils';
import { model, Schema } from 'mongoose';
import type { CommentDocument } from './comment.types';

const CommentSchema = new Schema<CommentDocument>(
  {
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.POST },
    senderId: { type: Schema.Types.ObjectId, required: true, ref: ModelName.USER },
  },
  { timestamps: true },
);

const commentModel = model<CommentDocument>(ModelName.COMMENT, CommentSchema);

export default commentModel;
