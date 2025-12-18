import { postModel, type CreatePostDTO, type Post } from '@post';
import { Router } from 'express';

const postsRouter = Router();

postsRouter.post<unknown, Post | string, CreatePostDTO>('', async (request, response) => {
  const createPostDTO = request.body;

  const newPost = await postModel.insertOne(createPostDTO);

  response.send(newPost);
});

postsRouter.get<unknown, Post[] | string>('', async (request, response) => {
  const posts = await postModel.find();

  response.send(posts);
});

export default postsRouter;
