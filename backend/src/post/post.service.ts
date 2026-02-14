import { Service, type FilterQuery } from '@utils';
import { pick } from 'lodash';
import type { QueryFilter, QueryOptions } from 'mongoose';
import postModel from './post.model';
import type { CreatePostDTO, ParsedPost, PostDocument, PostWithSender, UpdatePostDTO } from './post.types';

const parsePost = (post: PostWithSender): ParsedPost => {
  return {
    ...pick(post, 'title', 'content', 'imageURL', 'createdAt', 'updatedAt'),
    id: post._id.toString(),
    commentsAmount: 0,
    //  post.commentsAmount ?? 0,
    author: {
      ...pick(post.senderId, 'username', 'profilePictureURL'),
      id: post.senderId._id.toString(),
    },
  };
};

export default class PostService extends Service<PostDocument, CreatePostDTO, UpdatePostDTO> {
  constructor() {
    super(postModel);
  }

  async getParsedPosts({ senderId }: FilterQuery<PostDocument> = {}, options?: QueryOptions<PostDocument>) {
    const postsFilter = (senderId ? { senderId } : {}) satisfies QueryFilter<PostDocument>;

    const posts = (await super.getMany(postsFilter, {
      populate: { path: 'senderId' },
      lean: true,
      ...options,
    })) as unknown as PostWithSender[];

    const parsedPosts = posts.map(parsePost);

    return parsedPosts;
  }
}
