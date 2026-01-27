import { Service, type FilterQuery } from '@utils';
import type { QueryFilter } from 'mongoose';
import postModel from './post.model';
import type { CreatePostDTO, PostDocument, UpdatePostDTO } from './post.types';

export default class PostService extends Service<PostDocument, CreatePostDTO, UpdatePostDTO> {
  constructor() {
    super(postModel);
  }

  getMany({ senderId }: FilterQuery<PostDocument> = {}) {
    const postsFilter = (senderId ? { senderId } : {}) satisfies QueryFilter<PostDocument>;

    return super.getMany(postsFilter);
  }
}
