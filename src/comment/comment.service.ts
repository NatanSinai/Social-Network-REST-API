import { Service, type FilterQuery } from '@utils';
import type { QueryFilter } from 'mongoose';
import commentModel from './comment.model';
import type { CommentDocument, CreateCommentDTO, UpdateCommentDTO } from './comment.types';

export default class CommentService extends Service<CommentDocument, CreateCommentDTO, UpdateCommentDTO> {
  constructor() {
    super(commentModel);
  }

  getMany({ postId }: FilterQuery<CommentDocument> = {}) {
    const commentsFilter = (postId ? { postId } : {}) satisfies QueryFilter<CommentDocument>;

    return super.getMany(commentsFilter);
  }
}
