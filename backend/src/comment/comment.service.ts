import { ModelName, Service, type FilterQuery } from '@utils';
import { Types } from 'mongoose';
import commentModel from './comment.model';
import type { CommentDocument, CreateCommentDTO, UpdateCommentDTO } from './comment.types';

export default class CommentService extends Service<CommentDocument, CreateCommentDTO, UpdateCommentDTO> {
  constructor() {
    super(commentModel);
  }

  async getMany({ postId }: FilterQuery<CommentDocument> = {}) {
    const commentsFilter: any = {};
    if (postId) {
      commentsFilter.postId = typeof postId === 'string' ? new Types.ObjectId(postId) : postId;
    }

    const comments = await commentModel.aggregate([
      { $match: commentsFilter },
      {
        $lookup: {
          from: ModelName.USER,
          localField: 'senderId',
          foreignField: '_id',
          as: 'author',
        },
      },
      { $unwind: '$author' },
      {
        $project: {
          id: { $toString: '$_id' },
          _id: 0,
          content: 1,
          postId: { $toString: '$postId' },
          createdAt: 1,
          updatedAt: 1,
          author: {
            id: { $toString: '$author._id' },
            username: '$author.username',
            profilePictureURL: {
              $ifNull: ['$author.profilePictureURL', null],
            },
          },
        },
      },
      { $sort: { createdAt: 1 } },
    ]);

    return comments;
  }
}
