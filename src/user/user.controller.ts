import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import UserService from './user.service';
import type { UpdateUserDTO, User, UserDocument } from './user.types';

const usersRouter = Router();
const userService = new UserService();

const respondWithNotFoundUser = (userId: User['_id'], response: Response) =>
  respondWithNotFound(userId, response, 'user');

usersRouter.get('', (request, response) => {
  response.send('WIP');
});

/* Get User by ID */
usersRouter.get<{ userId: User['_id'] }>('/:userId', async (request, response) => {
  const { userId } = request.params;

  if (!isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const user = await userService.getById(userId);

  if (!user) return respondWithNotFoundUser(userId, response);

  response.send(user);
});

/* Update User */
usersRouter.put<{ userId: User['_id'] }, UserDocument, UpdateUserDTO>('/:userId', async (request, response) => {
  const { userId } = request.params;
  const updateUserDTO = request.body;

  if (!isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const updatedUser = await userService.updateById(userId, updateUserDTO);

  if (!updatedUser) return respondWithNotFoundUser(userId, response);

  response.send(updatedUser);
});

/* Delete User */
usersRouter.delete<{ userId: User['_id'] }>('/:userId', async (request, response) => {
  const { userId } = request.params;

  if (!isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const deletedUser = await userService.deleteById(userId);

  if (!deletedUser) return respondWithNotFoundUser(userId, response);

  response.send(deletedUser);
});

export default usersRouter;
