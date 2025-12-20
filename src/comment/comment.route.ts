import {
  commentModel,
  type Comment,
  type CommentDocument,
  type CreateCommentDTO,
  type UpdateCommentDTO,
} from '@comment';
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

/* Update Comment */
commentsRouter.put<{ commentId: Comment['_id'] }, CommentDocument, UpdateCommentDTO>(
  '/:commentId',
  async (request, response) => {
    const { commentId } = request.params;
    const updateCommentDTO = request.body;

    if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

    const updatedComment = await commentModel.findByIdAndUpdate(commentId, updateCommentDTO, { new: true });

    if (!updatedComment) return respondWithNotFoundComment(commentId, response);

    response.send(updatedComment);
  },
);

/* Delete Comment */
commentsRouter.delete<{ commentId: Comment['_id'] }>('/:commentId', async (request, response) => {
  const { commentId } = request.params;

  if (!isValidObjectId(commentId)) return respondWithInvalidId(commentId, response, 'comment');

  const deletedComment = await commentModel.findByIdAndDelete(commentId);

  if (!deletedComment) return respondWithNotFoundComment(commentId, response);

  response.send(deletedComment);
});

export default commentsRouter;
