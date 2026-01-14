import { respondWithInvalidId, respondWithNotFound } from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import UserService from './user.service';
import type { UpdateUserDTO, User, UserDocument } from './user.types';

const usersRouter = Router();
const userService = new UserService();

const respondWithNotFoundUser = (userId: User['_id'], response: Response) =>
  respondWithNotFound(userId, response, 'user');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *     responses:
 *       200:
 *         description: Created user
 */
usersRouter.post('', async (req, res) => {
  const user = await userService.createSingle(req.body);
  res.send(user);
});

/* Get User by ID */
/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { $ref: '#/components/schemas/DocumentMetadata/properties/_id' }
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/User' }
 *       404:
 *         description: User not found
 */
usersRouter.get<{ userId: User['_id'] }>('/:userId', async (request, response) => {
  const { userId } = request.params;

  if (!isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const user = await userService.getById(userId);

  if (!user) return respondWithNotFoundUser(userId, response);

  response.send(user);
});

/* Update User */
/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { $ref: '#/components/schemas/DocumentMetadata/properties/_id' }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateUserDTO' }
 *     responses:
 *       200:
 *         description: Updated user
 */
usersRouter.put<{ userId: User['_id'] }, UserDocument, UpdateUserDTO>('/:userId', async (request, response) => {
  const { userId } = request.params;
  const updateUserDTO = request.body;

  if (!isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const updatedUser = await userService.updateById(userId, updateUserDTO);

  if (!updatedUser) return respondWithNotFoundUser(userId, response);

  response.send(updatedUser);
});

/* Delete User */
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { $ref: '#/components/schemas/DocumentMetadata/properties/_id' }
 *     responses:
 *       200:
 *         description: Deleted user
 */
usersRouter.delete<{ userId: User['_id'] }>('/:userId', async (request, response) => {
  const { userId } = request.params;

  if (!isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const deletedUser = await userService.deleteById(userId);

  if (!deletedUser) return respondWithNotFoundUser(userId, response);

  response.send(deletedUser);
});

export default usersRouter;
