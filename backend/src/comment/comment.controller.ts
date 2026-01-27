import { authMiddleware } from '@middlewares';
import PostService from '@post/post.service';
import UserService from '@user/user.service';
import { respondWithInvalidId, respondWithNotFoundById } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import CommentService from './comment.service';
import type { Comment, CommentDocument, CreateCommentDTO, UpdateCommentDTO } from './comment.types';

const commentsRouter = Router();
const commentService = new CommentService();
const userService = new UserService();
const postService = new PostService();

const respondWithNotFoundComment = (commentId: Comment['_id'], response: Response) =>
  respondWithNotFoundById(commentId, response, 'comment');

/* Create Comment */
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentDTO'
 *     responses:
 *       200:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
commentsRouter.post<unknown, CommentDocument, Omit<CreateCommentDTO, 'senderId'>>(
  '',
  authMiddleware(),
  async (request, response) => {
    const createCommentDTO = request.body;
    const senderId = request.userId;

    if (!isValidObjectId(createCommentDTO.postId))
      return respondWithInvalidId(createCommentDTO.postId, response, 'post');

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const isUserExists = await userService.existsById(senderId);

    if (!isUserExists) return respondWithNotFoundById(senderId, response, 'sender');

    const isPostExists = await postService.existsById(createCommentDTO.postId);

    if (!isPostExists) return respondWithNotFoundById(createCommentDTO.postId, response, 'post');

    const newComment = await commentService.createSingle({ ...createCommentDTO, senderId });

    response.send(newComment);
  },
);

/* Update Comment */
/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentDTO'
 *     responses:
 *       200:
 *         description: Comment updated
 */
commentsRouter.put<{ commentId: Comment['_id'] }, CommentDocument, UpdateCommentDTO>(
  '/:commentId',
  authMiddleware(),
  async (request, response) => {
    const { commentId } = request.params;
    const updateCommentDTO = request.body;
    const senderId = request.userId;

    if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const isUserExist = await userService.existsById(senderId);
    const currentComment = await commentService.getById(commentId);

    if (!isUserExist || !currentComment || currentComment.senderId.toString() !== senderId.toString())
      return respondWithNotFoundById(senderId, response, 'sender');

    const updatedComment = await commentService.updateById(commentId, updateCommentDTO);

    /* istanbul ignore next */
    if (!updatedComment) return respondWithNotFoundComment(commentId, response);

    response.send(updatedComment);
  },
);

/* Get All Comments By Post Id*/
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
commentsRouter.get<unknown, CommentDocument[], unknown, Partial<Pick<Comment, 'postId'>>>(
  '',
  async (request, response) => {
    const { postId } = request.query;

    if (!!postId && !isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

    const comments = await commentService.getMany({ postId });

    response.send(comments);
  },
);

/* Get Comment By ID */
/**
 * @swagger
 * /comments/{commentId}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: Comment found
 */
commentsRouter.get<{ commentId: Comment['_id'] }>('/:commentId', async (request, response) => {
  const { commentId } = request.params;

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const comment = await commentService.getById(commentId);

  if (!comment) return respondWithNotFoundComment(commentId, response);

  response.send(comment);
});

/* Delete Comment */
/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: Comment deleted
 */
commentsRouter.delete<{ commentId: Comment['_id'] }>('/:commentId', authMiddleware(), async (request, response) => {
  const { commentId } = request.params;
  const senderId = request.userId;

  if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const isUserExist = await userService.existsById(senderId);
  const currentComment = await commentService.getById(commentId);

  if (!isUserExist || !currentComment || currentComment.senderId.toString() !== senderId.toString())
    return respondWithNotFoundById(senderId, response, 'sender');

  const deletedComment = await commentService.deleteById(commentId);

  /* istanbul ignore next */
  if (!deletedComment) return respondWithNotFoundComment(commentId, response);

  response.send(deletedComment);
});

export default commentsRouter;
