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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Access token returned, refresh token set in cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 */
authRouter.post<unknown, { accessToken: string }, UserCredentials>('/login', async (request, response) => {
  const credentials = request.body;

  const { user, errorMessage } = await userService.getOneByCredentials(credentials);

  if (errorMessage) return respondWithNotFound(response, errorMessage);

  const { accessToken, refreshToken } = await authService.generateUserTokens({
    userId: user._id,
    ipAddress: request.ip,
  });

  addCookieToResponse({ response, cookieName: CookieName.REFRESH_TOKEN, cookieValue: refreshToken });

  response.json({ accessToken });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     security:
 *       - BearerAuth: []
 *       - RefreshTokenCookie: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 *     security:
 *       - RefreshTokenCookie: []
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newAccessToken:
 *                   type: string
 */
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

/**
 * @swagger
 * /auth/google:
 * post:
 * tags: [Auth]
 * summary: Google Sign-In
 */
authRouter.post('/google', async (request, response) => {
  const { idToken } = request.body;

  if (!idToken) return respondWithUnauthorized(response, 'No ID Token provided',  NoAuthorizationReason.NO_TOKEN);

  const googleUser = await authService.verifyGoogleToken(idToken);
  if ('error' in googleUser) {
    return respondWithUnauthorized(response, googleUser.error, NoAuthorizationReason.GOOGLE_TOKEN_INVALID);
  }

  const user = await userService.getOrCreateByGoogle({email: googleUser.email, name: googleUser.name || googleUser.email.split('@')[0]!, googleId: googleUser.googleId});

  const { accessToken, refreshToken } = await authService.generateUserTokens({
    userId: user._id,
    ipAddress: request.ip,
  });

  addCookieToResponse({ 
    response, 
    cookieName: CookieName.REFRESH_TOKEN, 
    cookieValue: refreshToken 
  });

  response.json({ accessToken });
});

export default authRouter;
