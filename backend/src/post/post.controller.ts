import AIService from '@/ai.service';
import { aiCooldownMiddleware } from '@/middlewares/aiCooldown.middleware';
import { authMiddleware } from '@middlewares';
import UserService from '@user/user.service';
import {
  createUploadedFilePath,
  deleteFile,
  envVar,
  respondWithInvalidId,
  respondWithNotFoundById,
  upload,
} from '@utils';
import { Router, type Response } from 'express';
import { readFile } from 'fs/promises';
import { verify } from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import { setTimeout } from 'timers/promises';
import PostService from './post.service';
import type { CreatePostDTO, ParsedPost, Post, PostDocument, UpdatePostDTO } from './post.types';

const POST_IMAGE_FIELD = 'image';

const postsRouter = Router();
const postService = new PostService();
const userService = new UserService();
const aiService = new AIService();

const respondWithNotFoundPost = (postId: Post['_id'], response: Response) =>
  respondWithNotFoundById(postId, response, 'post');

// 1. Generate Image from Text
postsRouter.post<{}, Pick<Post, 'imageURL'>, Pick<Post, 'title' | 'content'>>(
  '/generate-image',
  authMiddleware(),
  aiCooldownMiddleware,
  async (req, res) => {
    const { title, content } = req.body;

    const prompt = `${title.trim()}. ${content.trim()}`;
    const imageURL = await aiService.generateImage(prompt);

    res.send({ imageURL });
  },
);

// 2. Generate Content from Image
postsRouter.post<{}, Pick<Post, 'content'> | string, Pick<Post, 'title'>>(
  '/generate-content',
  authMiddleware(),
  aiCooldownMiddleware,
  upload.single('image'),
  async (request, response) => {
    const { title } = request.body;

    if (!request.file) return response.status(400).send('Image required');

    const fileBuffer = await readFile(request.file.path);

    const content = await aiService.generateContent(title.trim(), fileBuffer);

    response.send({ content });
  },
);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post created
 */
postsRouter.post<{}, PostDocument, Omit<CreatePostDTO, 'senderId'>>(
  '',
  authMiddleware(),
  upload.single(POST_IMAGE_FIELD),
  async ({ file, body, userId: senderId }, response) => {
    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const user = await userService.getById(senderId);

    if (!user) return respondWithNotFoundById(senderId, response, 'sender');

    const imageURL = createUploadedFilePath(file);
    const createPostDTO = { imageURL, ...body, senderId } satisfies CreatePostDTO;

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated
 */
postsRouter.put<{ postId: string }, PostDocument, Omit<UpdatePostDTO, 'imageURL'>>(
  '/:postId',
  authMiddleware(),
  upload.single(POST_IMAGE_FIELD),
  async ({ params, body: { isDeleteImage, ...updatePostDTOWithoutImageURL }, userId: senderId, file }, response) => {
    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    if (!isValidObjectId(params.postId)) return respondWithInvalidId(params.postId, response, 'post');

    const postId = params.postId as unknown as Post['_id'];

    const isUserExist = await userService.existsById(senderId);
    const currentPost = await postService.getById(postId);

    if (!isUserExist || !currentPost || currentPost.senderId.toString() !== senderId.toString())
      return respondWithNotFoundById(senderId, response, 'sender');

    const updatePostDTO = { ...updatePostDTOWithoutImageURL, imageURL: currentPost.imageURL } satisfies UpdatePostDTO;

    if (file) {
      if (currentPost.imageURL) await deleteFile(currentPost.imageURL);

      updatePostDTO.imageURL = createUploadedFilePath(file);
    } else if (isDeleteImage === 'true') {
      if (currentPost.imageURL) await deleteFile(currentPost.imageURL);

      updatePostDTO.imageURL = null;
    }

    const updatedPost = await postService.updateById(postId, updatePostDTO);

    /* istanbul ignore next */
    if (!updatedPost) return respondWithNotFoundPost(postId, response);

    response.send(updatedPost);
  },
);

/* Get Posts (Optionally By Sender ID and paginated) */
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
 *         description: Paginated list of posts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPosts'
 */
postsRouter.get<
  unknown,
  { posts: ParsedPost[]; total: number; page: number; pages: number },
  unknown,
  { sender?: Post['senderId']; page?: string; limit?: string }
>('', async (request, response) => {
  const { sender: senderId, page: pageString = '1', limit: limitString = '10' } = request.query;

  const token = request.headers.authorization?.split(' ')[1];
  let currentUserId: string | undefined;

  if (token) {
    try {
      const { userId } = verify(token, envVar.JWT_SECRET) as { userId: string };
      currentUserId = userId;
    } catch { 
      console.log('Invalid token');
    }
  }

  if (!!senderId && !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  const page = Number(pageString);
  const limit = Number(limitString);

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    postService.getParsedPosts({ senderId }, { skip, limit, sort: { createdAt: -1 }, currentUserId }),
    postService.count(senderId ? { senderId } : {}),
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

  await setTimeout(5000);

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

/* Toggle Like Post */
/**
 * @swagger
 * /posts/{postId}/like:
 *   put:
 *     summary: Toggle like post
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
 *         description: Post like toggled
 */
postsRouter.put<{ postId: Post['_id'] }>('/:postId/like', authMiddleware(), async (request, response) => {
  const { postId } = request.params;
  const userId = request.userId;

  if (!userId || !isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');
  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const updatedPost = await postService.toggleLike(postId, userId);

  if (!updatedPost) return respondWithNotFoundPost(postId, response);

  response.send(updatedPost);
});

export default postsRouter;
