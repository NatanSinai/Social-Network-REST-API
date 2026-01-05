import { isDuplicateKeyMongoError, respondWithBadRequest } from '@utils';
import { Router } from 'express';
import UserService from './user.service';
import type { CreateUserDTO } from './user.types';

const usersRouter = Router();
const userService = new UserService();

usersRouter.post<unknown, { message: string }, CreateUserDTO>('/signup', async (request, response) => {
  const createUserDTO = request.body;

  try {
    const newUser = await userService.createSingle(createUserDTO);

    response.json({ message: `User was registered successfully with id ${newUser._id}` });
  } catch (error) {
    if (isDuplicateKeyMongoError(error))
      respondWithBadRequest(response, `Username '${createUserDTO.username}' already exists`);
  }
});

export default usersRouter;
