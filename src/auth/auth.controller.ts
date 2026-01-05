import UserRefreshTokenService from '@/userRefreshToken/userRefreshToken.service';
import UserService from '@user/user.service';
import type { User } from '@user/user.types';
import { respondWithNotFound } from '@utils';
import { compareSync } from 'bcrypt';
import { Router } from 'express';
import type { ObjectId } from 'mongoose';
import { pick } from 'rambda';
import AuthService from './auth.service';
import type { TokensPayload } from './auth.types';

const authsRouter = Router();
const authService = new AuthService();
const userService = new UserService();
const userRefreshTokenService = new UserRefreshTokenService();

authsRouter.post<unknown, TokensPayload, Pick<User, 'username' | 'password'>>('/login', async (request, response) => {
  const { username, password } = request.body;

  const user = await userService.getOne({ username });

  if (!user) return respondWithNotFound(response, 'Invalid username');

  const isPasswordsMatch = compareSync(password, user.password);

  if (!isPasswordsMatch) return respondWithNotFound(response, 'Invalid password');

  const userId = user._id as unknown as ObjectId;
  const userPayload = pick('_id')(user);
  const { accessToken, refreshToken } = authService.generateTokens(userPayload);

  const userToken = await userRefreshTokenService.getOne({ userId });

  if (userToken) await userRefreshTokenService.deleteById(userToken._id);

  await userRefreshTokenService.createSingle({ userId, refreshToken });

  response.json({ accessToken, refreshToken });
});

export default authsRouter;
