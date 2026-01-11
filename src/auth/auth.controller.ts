import { authMiddleware } from '@middlewares';
import UserService from '@user/user.service';
import type { UserCredentials } from '@user/user.types';
import {
  addCookieToResponse,
  CookieName,
  NoAuthorizationReason,
  respondWithInvalidId,
  respondWithJSONMessage,
  respondWithNoContent,
  respondWithNotFound,
  respondWithUnauthorized,
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

  const { accessToken, refreshToken } = await authService.generateUserTokens({ userId: user._id, ip: request.ip });

  addCookieToResponse({ response, cookieName: CookieName.REFRESH_TOKEN, cookieValue: refreshToken });

  response.json({ accessToken });
});

authRouter.post('/logout', authMiddleware(), async (request, response) => {
  const {
    userId,
    authCookies: { refreshToken },
  } = request;

  if (!refreshToken) return respondWithNoContent(response, 'No refresh token provided');

  if (!userId || !isValidObjectId(userId)) return respondWithInvalidId(userId, response, 'user');

  await authService.removeRefreshToken({ response, refreshToken });

  respondWithJSONMessage(response, 'Logged out successfully');
});

authRouter.post('/refresh', async (request, response) => {
  const refreshToken = request.cookies?.refreshToken;

  if (!refreshToken) return respondWithUnauthorized(response, 'No refresh token', NoAuthorizationReason.NO_TOKEN);

  const newTokensOrErrorConfig = await authService.refreshAccessToken({ refreshToken });

  if (!newTokensOrErrorConfig.tokens)
    return respondWithUnauthorized(response, newTokensOrErrorConfig.message, newTokensOrErrorConfig.reason);

  const { newAccessToken, newRefreshToken } = newTokensOrErrorConfig.tokens;

  addCookieToResponse({ response, cookieName: CookieName.REFRESH_TOKEN, cookieValue: newRefreshToken });

  response.json({ newAccessToken });
});

export default authRouter;
