import { ModelName, Service, type FilterQuery } from '@utils';
import { Types, type QueryOptions } from 'mongoose';
import postModel from './post.model';
import type { CreatePostDTO, ParsedPost, PostDocument, UpdatePostDTO } from './post.types';

export default class PostService extends Service<PostDocument, CreatePostDTO, UpdatePostDTO> {
  constructor() {
    super(postModel);
  }

  async getParsedPosts({ senderId }: FilterQuery<PostDocument> = {}, options?: QueryOptions<PostDocument>) {
    const postsFilter: any = {};
    if (senderId) {
      postsFilter.senderId = typeof senderId === 'string' ? new Types.ObjectId(senderId) : senderId;
    }

    const posts = await postModel.aggregate<ParsedPost>([
      { $match: postsFilter },

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
        $lookup: {
          from: ModelName.COMMENT,
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$postId', '$$postId'] },
              },
            },
            { $count: 'count' },
          ],
          as: 'commentsMeta',
        },
      },
      {
        $addFields: {
          commentsAmount: {
            $ifNull: [{ $arrayElemAt: ['$commentsMeta.count', 0] }, 0],
          },
        },
      },
      {
        $project: {
          id: { $toString: '$_id' },
          _id: 0,

          title: 1,
          content: 1,
          imageURL: 1,
          createdAt: 1,
          updatedAt: 1,
          commentsAmount: 1,

          author: {
            id: { $toString: '$author._id' },
            username: '$author.username',
            profilePictureURL: {
              $ifNull: ['$author.profilePictureURL', null],
            },
          },
        },
      },

      { $sort: options?.sort ?? { createdAt: -1 } },
      { $skip: options?.skip ?? 0 },
      { $limit: options?.limit ?? 10 },
    ]);

    return posts;
  }
}
