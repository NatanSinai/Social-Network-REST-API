import { respondWithInvalidId, respondWithNotFoundById } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import CommentService from './comment.service';
import { type Comment, type CommentDocument, type CreateCommentDTO, type UpdateCommentDTO } from './comment.types';

const commentsRouter = Router();
const commentService = new CommentService();

const respondWithNotFoundComment = (commentId: Comment['_id'], response: Response) =>
  respondWithNotFoundById(commentId, response, 'comment');

/* Create Comment */
commentsRouter.post<unknown, CommentDocument, CreateCommentDTO>('', async (request, response) => {
  const createCommentDTO = request.body;

  if (!isValidObjectId(createCommentDTO.postId)) return respondWithInvalidId(createCommentDTO.postId, response, 'post');

  if (!isValidObjectId(createCommentDTO.senderId))
    return respondWithInvalidId(createCommentDTO.senderId, response, 'sender');

  const newComment = await commentService.createSingle(createCommentDTO);

  response.send(newComment);
});

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

/* Update Comment */
commentsRouter.put<{ commentId: Comment['_id'] }, CommentDocument, UpdateCommentDTO>(
  '/:commentId',
  async (request, response) => {
    const { commentId } = request.params;
    const updateCommentDTO = request.body;

    if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

    const updatedComment = await commentService.updateById(commentId, updateCommentDTO, { new: true });

    if (!updatedComment) return respondWithNotFoundComment(commentId, response);

    response.send(updatedComment);
  },
);

/* Delete Comment */
commentsRouter.delete<{ commentId: Comment['_id'] }>('/:commentId', async (request, response) => {
  const { commentId } = request.params;

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const deletedComment = await commentService.deleteById(commentId);

  if (!deletedComment) return respondWithNotFoundComment(commentId, response);

  response.send(deletedComment);
});

export default commentsRouter;
