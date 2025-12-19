import { postModel, type CreatePostDTO, type Post } from '@post';
import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';

const postsRouter = Router();

const respondWithNotFoundPost = (postId: Post['_id'], response: Response) =>
  respondWithNotFound(postId, response, 'post');

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

  if (!post) return respondWithNotFoundPost(postId, response);

  response.send(post);
});

postsRouter.delete('', async (request, response) => {
  const deleteResult = await postModel.deleteMany();

  response.send(deleteResult);
});

postsRouter.delete<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const deleteResult = await postModel.deleteOne({ _id: postId });

  if (!deleteResult.deletedCount) return respondWithNotFoundPost(postId, response);

  response.send(deleteResult);
});

export default postsRouter;
