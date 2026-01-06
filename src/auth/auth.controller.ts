import UserService from '@user/user.service';
import type { UserCredentials } from '@user/user.types';
import { respondWithNotFound } from '@utils';
import { Router } from 'express';
import AuthService from './auth.service';
import type { TokensPayload } from './auth.types';

const authRouter = Router();

const authService = new AuthService();
const userService = new UserService();

authRouter.post<unknown, TokensPayload, UserCredentials>('/login', async (request, response) => {
  const credentials = request.body;

  const { user, message } = await userService.getOneByCredentials(credentials);

  if (message) return respondWithNotFound(response, message);

  const tokensPayload = await authService.generateUserTokens(user);

  response.json(tokensPayload);
});

export default authRouter;
