import { authMiddleware } from '@middlewares';
import { respondWithInvalidId, respondWithNotFoundById } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import PostService from './post.service';
import type { CreatePostDTO, Post, PostDocument, UpdatePostDTO } from './post.types';

const postsRouter = Router();
const postService = new PostService();

const respondWithNotFoundPost = (postId: Post['_id'], response: Response) =>
  respondWithNotFoundById(postId, response, 'post');

postsRouter.post<unknown, PostDocument, Omit<CreatePostDTO, 'senderId'>>(
  '',
  authMiddleware(),
  async (request, response) => {
    const senderId = request.userId;
    const createPostDTO = request.body;

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const newPost = await postService.createSingle({ ...createPostDTO, senderId });

    response.send(newPost);
  },
);

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

postsRouter.put<{ postId: Post['_id'] }, PostDocument, UpdatePostDTO>(
  '/:postId',
  authMiddleware(),
  async (request, response) => {
    const { postId } = request.params;
    const updatePostDTO = request.body;
    const senderId = request.userId;

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(postId, response, 'sender');

    if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

    const updatedPost = await postService.updateById(postId, updatePostDTO);

    if (!updatedPost) return respondWithNotFoundPost(postId, response);

    response.send(updatedPost);
  },
);

// Bonus - Deletion Routes
postsRouter.delete('', async (request, response) => {
  const deleteResult = await postService.deleteMany();

  response.send(deleteResult);
});

postsRouter.delete<{ postId: Post['_id'] }>('/:postId', authMiddleware(), async (request, response) => {
  const { postId } = request.params;
  const senderId = request.userId;

  if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(postId, response, 'sender');

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const deletedPost = await postService.deleteById(postId);

  if (!deletedPost) return respondWithNotFoundPost(postId, response);

  response.send(deletedPost);
});

export default postsRouter;
