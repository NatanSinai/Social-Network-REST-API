import { postModel, type CreatePostDTO, type Post } from '@post';
import { respondWithInvalidId } from '@utils';
import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { isValidObjectId } from 'mongoose';

const postsRouter = Router();

postsRouter.post<unknown, Post, CreatePostDTO>('', async (request, response) => {
  const createPostDTO = request.body;

  if (!isValidObjectId(createPostDTO.senderId)) return respondWithInvalidId(createPostDTO.senderId, response, 'user');

  const newPost = await postModel.create(createPostDTO);

  response.send(newPost);
});

postsRouter.get<unknown, Post[], unknown, { sender?: Post['senderId'] }>('', async (request, response) => {
  const { sender: senderId } = request.query;

  if (!!senderId && !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'user');

  const posts = await postModel.find(senderId ? { senderId } : {});

  response.send(posts);
});

postsRouter.get<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const post = await postModel.findOne({ _id: postId });

  if (!post) return response.status(StatusCodes.NOT_FOUND).json({ message: `No post with id '${postId}'` });

  response.send(post);
});

export default postsRouter;
