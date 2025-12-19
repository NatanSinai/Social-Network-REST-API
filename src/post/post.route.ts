import { postModel, type CreatePostDTO, type Post, type PostDocument, type UpdatePostDTO } from '@post';
import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId, type QueryFilter } from 'mongoose';

const postsRouter = Router();

const respondWithNotFoundPost = (postId: Post['_id'], response: Response) =>
  respondWithNotFound(postId, response, 'post');

postsRouter.post<unknown, PostDocument, CreatePostDTO>('', async (request, response) => {
  const createPostDTO = request.body;

  if (!isValidObjectId(createPostDTO.senderId)) return respondWithInvalidId(createPostDTO.senderId, response, 'sender');

  const newPost = await postModel.create(createPostDTO);

  response.send(newPost);
});

postsRouter.get<unknown, PostDocument[], unknown, { sender?: Post['senderId'] }>('', async (request, response) => {
  const { sender: senderId } = request.query;

  if (!!senderId && !isValidObjectId(senderId)) return respondWithInvalidId(senderId, response, 'sender');

  const postsFilter = (senderId ? { senderId } : {}) satisfies QueryFilter<PostDocument>;
  const posts = await postModel.find(postsFilter);

  response.send(posts);
});

postsRouter.get<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const post = await postModel.findById(postId);

  if (!post) return respondWithNotFoundPost(postId, response);

  response.send(post);
});

postsRouter.put<{ postId: Post['_id'] }, PostDocument, UpdatePostDTO>('/:postId', async (request, response) => {
  const { postId } = request.params;
  const updatePostDTO = request.body;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const updatedPost = await postModel.findByIdAndUpdate(postId, updatePostDTO, { new: true });

  if (!updatedPost) return respondWithNotFoundPost(postId, response);

  response.send(updatedPost);
});

// Bonus - Deletion Routes
postsRouter.delete('', async (request, response) => {
  const deleteResult = await postModel.deleteMany();

  response.send(deleteResult);
});

postsRouter.delete<{ postId: Post['_id'] }>('/:postId', async (request, response) => {
  const { postId } = request.params;

  if (!isValidObjectId(postId)) return respondWithInvalidId(postId, response, 'post');

  const deletedPost = await postModel.findByIdAndDelete(postId);

  if (!deletedPost) return respondWithNotFoundPost(postId, response);

  response.send(deletedPost);
});

export default postsRouter;
