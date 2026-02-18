import { authMiddleware } from '@middlewares';
import {
  createUploadedFilePath,
  isDuplicateKeyMongoError,
  respondWithBadRequest,
  respondWithInvalidId,
  respondWithJSONMessage,
  respondWithNotFoundById,
  upload,
} from '@utils';
import { Router, type Response } from 'express';
import { isValidObjectId } from 'mongoose';
import UserService from './user.service';
import type { CreateUserDTO, UpdateUserDTO, User, UserDocument } from './user.types';
const USER_IMAGE_FIELD = 'profilePicture';
const usersRouter = Router();
const userService = new UserService();

const respondWithNotFoundUser = (userId: User['_id'], response: Response) =>
  respondWithNotFoundById(userId, response, 'user');

/* Create User */
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
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
usersRouter.post<unknown, { message: string }, CreateUserDTO>('', async (request, response) => {
  const createUserDTO = request.body;

  try {
    const newUser = await userService.createSingle(createUserDTO);

    respondWithJSONMessage(response, `User was registered successfully with id ${newUser._id}`);
  } catch (error) {
    if (isDuplicateKeyMongoError(error))
      return respondWithBadRequest(response, `Username '${createUserDTO.username}' already exists`);
  }
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
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated user
 */
usersRouter.put<{ userId: string }, UserDocument, Omit<UpdateUserDTO, 'profilePictureURL'>>(
  '/:userId',
  authMiddleware(),
  upload.single(USER_IMAGE_FIELD),
  async (request, response) => {
    const { userId: paramsId } = request.params;
    const authenticatedUserId = request.userId;
    const { file, body: updateUserDTOWithoutImage } = request;

    // Safety check: Compare as strings
    const isOwner = authenticatedUserId?.toString() === paramsId;

    if (!isOwner || !isValidObjectId(paramsId)) {
      return respondWithInvalidId(paramsId, response, 'user');
    }

    const profilePictureURL = createUploadedFilePath(file);

    const updateUserDTO: UpdateUserDTO = {
      ...updateUserDTOWithoutImage,
      ...(profilePictureURL && { profilePictureURL }),
    };

    // FIX: Cast paramsId to any to satisfy the Service's ObjectId requirement
    const updatedUser = await userService.updateById(authenticatedUserId, updateUserDTO);

    if (!updatedUser) return respondWithNotFoundUser(authenticatedUserId, response);

    response.send(updatedUser);
  },
);

/* Delete User */
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/ObjectId'
 *     responses:
 *       200:
 *         description: Deleted user
 */
usersRouter.delete<{ userId: User['_id'] }>('/:userId', authMiddleware(), async (request, response) => {
  const { userId } = request.params;

  if (request.userId !== userId || !isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  const deletedUser = await userService.deleteById(userId);

  if (!deletedUser) return respondWithNotFoundUser(userId, response);

  response.send(deletedUser);
});

export default usersRouter;
