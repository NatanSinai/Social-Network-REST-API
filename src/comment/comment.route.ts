import { commentModel, type Comment, type CommentDocument, type CreateCommentDTO } from '@comment';
import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';

const commentsRouter = Router();

const respondWithNotFoundComment = (commentId: Comment['_id'], response: Response) =>
  respondWithNotFound(commentId, response, 'comment');

/* Create Comment */
commentsRouter.post<unknown, CommentDocument, CreateCommentDTO>('', async (request, response) => {
  const createCommentDTO = request.body;

  if (!isValidObjectId(createCommentDTO.postId)) return respondWithInvalidId(createCommentDTO.postId, response, 'post');
  if (!isValidObjectId(createCommentDTO.senderId))
    return respondWithInvalidId(createCommentDTO.senderId, response, 'sender');

  const newComment = await commentModel.create(createCommentDTO);

  response.send(newComment);
});
