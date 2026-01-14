import PostService from '@post/post.service';
import UserService from '@user/user.service';
import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import CommentService from './comment.service';
import { type Comment, type CommentDocument, type CreateCommentDTO, type UpdateCommentDTO } from './comment.types';

const commentsRouter = Router();
const commentService = new CommentService();
const userService = new UserService();
const postService = new PostService();
const respondWithNotFoundComment = (commentId: Comment['_id'], response: Response) =>
  respondWithNotFound(commentId, response, 'comment');

/* Create Comment */
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateCommentDTO' }
 *     responses:
 *       200:
 *         description: Comment created
 */
commentsRouter.post<unknown, CommentDocument, CreateCommentDTO>('', async (request, response) => {
  const createCommentDTO = request.body;

  if (!isValidObjectId(createCommentDTO.postId)) return respondWithInvalidId(createCommentDTO.postId, response, 'post');

  if (!isValidObjectId(createCommentDTO.senderId))
    return respondWithInvalidId(createCommentDTO.senderId, response, 'sender');

  const user = await userService.getById(createCommentDTO.senderId);
  if (!user) return respondWithNotFound(createCommentDTO.senderId, response, 'sender');

  const post = await postService.getById(createCommentDTO.postId);
  if (!post) return respondWithNotFound(createCommentDTO.postId, response, 'post');

  const newComment = await commentService.createSingle(createCommentDTO);

  response.send(newComment);
});

/* Update Comment */
/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Update comment
 *     tags: [Comments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateCommentDTO' }
 */
commentsRouter.put<{ commentId: Comment['_id'] }, CommentDocument, UpdateCommentDTO>(
  '/:commentId',
  async (request, response) => {
    const { commentId } = request.params;
    const updateCommentDTO = request.body;

    if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

    if (updateCommentDTO.senderId) {
      const user = await userService.getById(updateCommentDTO.senderId);
      if (!user) return respondWithNotFound(updateCommentDTO.senderId, response, 'sender');
    }

    const updatedComment = await commentService.updateById(commentId, updateCommentDTO);

    if (!updatedComment) return respondWithNotFoundComment(commentId, response);

    response.send(updatedComment);
  },
);

/* Get All Comments By Post Id*/
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments by Post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema: { $ref: '#/components/schemas/DocumentMetadata/properties/_id' }
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Comment' }
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
 */
commentsRouter.delete<{ commentId: Comment['_id'] }>('/:commentId', async (request, response) => {
  const { commentId } = request.params;

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const deletedComment = await commentService.deleteById(commentId);

  if (!deletedComment) return respondWithNotFoundComment(commentId, response);

  response.send(deletedComment);
});

export default commentsRouter;
