import { commentModel, type Comment, type CommentDocument, type CreateCommentDTO } from '@comment';
import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId, type QueryFilter } from 'mongoose';

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

/* Get All Comments By Post Id*/
commentsRouter.get<unknown, CommentDocument[], unknown, { postId?: Comment['postId'] }>(
  '',
  async (request, response) => {
    const { postId } = request.query;

    if (!!postId && !isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

    const commentsFilter = (postId ? { postId } : {}) satisfies QueryFilter<CommentDocument>;
    const comments = await commentModel.find(commentsFilter);

    response.send(comments);
  },
);

/* Get Comment By ID */
commentsRouter.get<{ commentId: Comment['_id'] }>('/:commentId', async (request, response) => {
  const { commentId } = request.params;

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const comment = await commentModel.findById(commentId);

  if (!comment) return respondWithNotFoundComment(commentId, response);

  response.send(comment);
});
