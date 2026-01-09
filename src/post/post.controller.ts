import UserService from '@user/user.service';
import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import PostService from './post.service';
import type { CreatePostDTO, Post, PostDocument, UpdatePostDTO } from './post.types';

const postsRouter = Router();
const postService = new PostService();
const userService = new UserService();

export const respondWithNotFoundPost = (postId: Post['_id'], response: Response) =>
  respondWithNotFound(postId, response, 'post');

postsRouter.post<unknown, PostDocument, CreatePostDTO>('', async (request, response) => {
  const createPostDTO = request.body;

  if (!isValidObjectId(createPostDTO.senderId)) return respondWithInvalidId(createPostDTO.senderId, response, 'sender');

  const user = await userService.getById(createPostDTO.senderId);
  if (!user) {
    return respondWithNotFound(createPostDTO.senderId, response, 'sender');
  }

  const newPost = await postService.createSingle(createPostDTO);
  await userService.updateById(createPostDTO.senderId, { postsCount: user.postsCount + 1 });

  response.send(newPost);
});

postsRouter.put<{ postId: Post['_id'] }, PostDocument, UpdatePostDTO>('/:postId', async (request, response) => {
  const { postId } = request.params;
  const updatePostDTO = request.body;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  if (updatePostDTO.senderId) {
    if (!isValidObjectId(updatePostDTO.senderId))
      return respondWithInvalidId(updatePostDTO.senderId, response, 'sender');
    const user = await userService.getById(updatePostDTO.senderId);
    if (!user) return respondWithNotFound(updatePostDTO.senderId, response, 'sender');
  }

  const updatedPost = await postService.updateById(postId, updatePostDTO);

  if (!updatedPost) return respondWithNotFoundPost(postId, response);

  response.send(updatedPost);
});

postsRouter.get<unknown, PostDocument[], unknown, { sender?: Post['senderId'] }>('', async (request, response) => {
  const { sender: senderId } = request.query;

  if (!!senderId && !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  const posts = await postService.getMany({ senderId });

  response.send(posts);
});

postsRouter.get<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const post = await postService.getById(postId);

  if (!post) return respondWithNotFoundPost(postId, response);

  response.send(post);
});

// Bonus - Deletion Routes
postsRouter.delete('', async (request, response) => {
  const deleteResult = await postService.deleteMany();

  response.send(deleteResult);
});

postsRouter.delete<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const deletedPost = await postService.deleteById(postId);

  if (!deletedPost) return respondWithNotFoundPost(postId, response);

  response.send(deletedPost);
});

export default postsRouter;
