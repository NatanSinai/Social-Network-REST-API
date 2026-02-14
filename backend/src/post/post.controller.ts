import { authMiddleware } from '@middlewares';
import UserService from '@user/user.service';
import { createUploadedFilePath, respondWithInvalidId, respondWithNotFoundById, upload } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import PostService from './post.service';
import type { CreatePostDTO, ParsedPost, Post, PostDocument, UpdatePostDTO } from './post.types';

const POST_IMAGE_FIELD = 'image';

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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostDTO'
 *     responses:
 *       200:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
postsRouter.post<{}, PostDocument, Omit<CreatePostDTO, 'senderId' | 'imageURL'>>(
  '',
  authMiddleware(),
  upload.single(POST_IMAGE_FIELD),
  async ({ file, body: createPostDTOWithoutImageURL, userId: senderId }, response) => {
    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const user = await userService.getById(senderId);

    if (!user) return respondWithNotFoundById(senderId, response, 'sender');

    const imageURL = createUploadedFilePath(file);
    const createPostDTO = { ...createPostDTOWithoutImageURL, senderId, imageURL } satisfies CreatePostDTO;

    const newPost = await postService.createSingle(createPostDTO);
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePostDTO'
 *     responses:
 *       200:
 *         description: Post updated
 */
postsRouter.put<{ postId: string }, PostDocument, Omit<UpdatePostDTO, 'imageURL'>>(
  '/:postId',
  authMiddleware(),
  upload.single(POST_IMAGE_FIELD),
  async ({ params, body: updatePostDTOWithoutImageURL, userId: senderId, file }, response) => {
    const imageURL = createUploadedFilePath(file);

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    if (!isValidObjectId(params.postId)) return respondWithInvalidId(params.postId, response, 'post');

    const postId = params.postId as unknown as Post['_id'];

    const isUserExist = await userService.existsById(senderId);
    const currentPost = await postService.getById(postId);

    if (!isUserExist || !currentPost || currentPost.senderId.toString() !== senderId.toString())
      return respondWithNotFoundById(senderId, response, 'sender');

    const updatedPost = await postService.updateById(postId, { ...updatePostDTOWithoutImageURL, imageURL });

    /* istanbul ignore next */
    if (!updatedPost) return respondWithNotFoundPost(postId, response);

    response.send(updatedPost);
  },
);

/* Get Posts (Optionally By Sender ID) */
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get posts (optionally by sender)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
postsRouter.get<
  unknown,
  { posts: ParsedPost[]; total: number; page: number; pages: number },
  unknown,
  { sender?: Post['senderId']; page?: string; limit?: string }
>('', async (request, response) => {
  const { sender: senderId, page: pageString = '1', limit: limitString = '10' } = request.query;

  if (!!senderId && !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  const page = Number(pageString);
  const limit = Number(limitString);

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    postService.getParsedPosts({ senderId }, { skip, limit, sort: { createdAt: -1 } }),
    postService.count(),
  ]);

  response.send({
    posts,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
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
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
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
 *     summary: Delete post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: Post deleted
 */
postsRouter.delete<{ postId: Post['_id'] }>('/:postId', authMiddleware(), async (request, response) => {
  const { postId } = request.params;
  const senderId = request.userId;

  if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const isUserExist = await userService.existsById(senderId);
  const currentPost = await postService.getById(postId);

  if (!isUserExist || !currentPost || currentPost.senderId.toString() !== senderId.toString())
    return respondWithNotFoundById(senderId, response, 'sender');

  const deletedPost = await postService.deleteById(postId);

  /* istanbul ignore next */
  if (!deletedPost) return respondWithNotFoundPost(postId, response);

  response.send(deletedPost);
});

export default postsRouter;
