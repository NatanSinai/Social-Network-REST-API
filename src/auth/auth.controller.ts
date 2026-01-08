import { authMiddleware } from '@middlewares';
import UserService from '@user/user.service';
import type { UserCredentials } from '@user/user.types';
import {
  addCookieToResponse,
  CookieName,
  respondWithInvalidId,
  respondWithJSONMessage,
  respondWithNotFound,
} from '@utils';
import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import AuthService from './auth.service';

const authRouter = Router();

const authService = new AuthService();
const userService = new UserService();

authRouter.post<unknown, { accessToken: string }, UserCredentials>('/login', async (request, response) => {
  const credentials = request.body;

  const { user, message } = await userService.getOneByCredentials(credentials);

  if (message) return respondWithNotFound(response, message);

  const { accessToken, refreshToken } = await authService.generateUserTokens(user);

  addCookieToResponse({ response, cookieName: CookieName.REFRESH_TOKEN, cookieValue: refreshToken });

  response.json({ accessToken });
});

authRouter.post('/logout', authMiddleware(), async (request, response) => {
  const { userId } = request;
  const { refreshToken } = request.authCookies;
  const logoutMessage = 'Logged out successfully';

  if (!refreshToken) return respondWithJSONMessage(response, logoutMessage);

  if (!userId || !isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  await authService.removeRefreshToken({ response, userId, refreshToken });

  respondWithJSONMessage(response, logoutMessage);
});

export default authRouter;
