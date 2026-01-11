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
commentsRouter.put<{ commentId: Comment['_id'] }, CommentDocument, UpdateCommentDTO>(
  '/:commentId',
  authMiddleware(),
  async (request, response) => {
    const { commentId } = request.params;
    const updateCommentDTO = request.body;
    const senderId = request.userId;

    if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

    if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

    const isUserExists = await userService.existsById(senderId);

    if (!isUserExists) return respondWithNotFoundById(senderId, response, 'sender');

    const updatedComment = await commentService.updateById(commentId, updateCommentDTO);

    if (!updatedComment) return respondWithNotFoundComment(commentId, response);

    response.send(updatedComment);
  },
);

/* Get All Comments By Post Id*/
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
commentsRouter.get<{ commentId: Comment['_id'] }>('/:commentId', async (request, response) => {
  const { commentId } = request.params;

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const comment = await commentService.getById(commentId);

  if (!comment) return respondWithNotFoundComment(commentId, response);

  response.send(comment);
});

/* Delete Comment */
commentsRouter.delete<{ commentId: Comment['_id'] }>('/:commentId', authMiddleware(), async (request, response) => {
  const { commentId } = request.params;
  const senderId = request.userId;

  if (!senderId || !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const deletedComment = await commentService.deleteById(commentId);

  if (!deletedComment) return respondWithNotFoundComment(commentId, response);

  response.send(deletedComment);
});

export default commentsRouter;
