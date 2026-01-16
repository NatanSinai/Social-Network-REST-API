import { authMiddleware } from '@middlewares';
import UserService from '@user/user.service';
import { respondWithInvalidId, respondWithNotFoundById } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import PostService from './post.service';
import type { CreatePostDTO, Post, PostDocument, UpdatePostDTO } from './post.types';

const postsRouter = Router();
const postService = new PostService();
const userService = new UserService();

const respondWithNotFoundPost = (postId: Post['_id'], response: Response) =>
  respondWithNotFoundById(postId, response, 'post');

/* Create Post */
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreatePostDTO' }
 *     responses:
 *       200:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Post' }
 */
postsRouter.post<unknown, PostDocument, Omit<CreatePostDTO, 'senderId'>>(
  '',
  authMiddleware(),
  async (request, response) => {
    const senderId = request.userId;
    const createPostDTO = request.body;

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const user = await userService.getById(senderId);

    if (!user) return respondWithNotFoundById(senderId, response, 'sender');

    const newPost = await postService.createSingle({ ...createPostDTO, senderId });
    await userService.updateById(senderId, { postsCount: user.postsCount + 1 });

    response.send(newPost);
  },
);

/* Update Post */
/**
 * @swagger
 * /posts/{postId}:
 *   put:
 *     summary: Update post
 *     tags: [Posts]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdatePostDTO' }
 */
postsRouter.put<{ postId: Post['_id'] }, PostDocument, UpdatePostDTO>(
  '/:postId',
  authMiddleware(),
  async (request, response) => {
    const { postId } = request.params;
    const updatePostDTO = request.body;
    const senderId = request.userId;

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

    const isUserExist = await userService.existsById(senderId);
    const currentPost = await postService.getById(postId);

    if (!isUserExist || !currentPost || currentPost.senderId.toString() !== senderId.toString())
      return respondWithNotFoundById(senderId, response, 'sender');

    const updatedPost = await postService.updateById(postId, updatePostDTO);

    if (!updatedPost) return respondWithNotFoundPost(postId, response);

    response.send(updatedPost);
  },
);

/* Get Posts (Optionally By Sender ID) */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get posts by sender ID
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema: { $ref: '#/components/schemas/DocumentMetadata/properties/_id' }
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Post' }
 */
postsRouter.get<unknown, PostDocument[], unknown, { sender?: Post['senderId'] }>('', async (request, response) => {
  const { sender: senderId } = request.query;

  if (!!senderId && !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  const posts = await postService.getMany({ senderId });

  response.send(posts);
});

/* Get Post By ID */
/**
 * @swagger
 * /posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema: { $ref: '#/components/schemas/DocumentMetadata/properties/_id' }
 *     responses:
 *       200:
 *         description: Post found
 */
postsRouter.get<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const post = await postService.getById(postId);

  if (!post) return respondWithNotFoundPost(postId, response);

  response.send(post);
});

/* Delete Post */
/**
 * @swagger
 * /posts/{postId}:
 *   delete:
 *     summary: Delete post by ID
 *     tags: [Posts]
 */
postsRouter.delete<{ postId: Post['_id'] }>('/:postId', authMiddleware(), async (request, response) => {
  const { postId } = request.params;
  const senderId = request.userId;

  if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(postId, response, 'sender');

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const isUserExist = await userService.existsById(senderId);
  const currentPost = await postService.getById(postId);

  if (!isUserExist || !currentPost || currentPost.senderId.toString() !== senderId.toString())
    return respondWithNotFoundById(senderId, response, 'sender');

  const deletedPost = await postService.deleteById(postId);

  if (!deletedPost) return respondWithNotFoundPost(postId, response);

  response.send(deletedPost);
});

export default postsRouter;
