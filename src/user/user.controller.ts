import { Router } from 'express';
import UserService from './user.service';

const usersRouter = Router();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userService = new UserService();

usersRouter.get('', (request, response) => {
  response.send('WIP');
});

export default usersRouter;
