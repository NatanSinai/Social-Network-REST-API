import { postModel, type CreatePostDTO, type Post } from '@post';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const postsRouter = Router();

postsRouter.post<unknown, Post | string, CreatePostDTO>('', async (req, res) => {
  const createPostDTO = req.body;

  try {
    const newPost = await postModel.insertOne(createPostDTO);

    res.send(newPost);
  } catch (e) {
    const error = e as Error;
    console.error(error);

    res.status(StatusCodes.BAD_REQUEST).send(error.message);
  }
});

export default postsRouter;
