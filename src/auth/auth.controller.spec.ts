import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { connectToMongoMemoryServer, createMongoMemoryServer } from '@utils';
import cookieParser from 'cookie-parser';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import userModel from '../user/user.model';
import UserService from '../user/user.service';
import authRouter from './auth.controller';
import AuthService from './auth.service';

const USER = {
  id: '507f1f77bcf86cd799439011',
  username: 'test user',
  password: '123456',
  email: 'test@test.com',
};

const INVALID_ID = 'invalid';

const getSetCookies = (response: request.Response) => {
  const cookies = response.headers['set-cookie'] as string | string[] | undefined;

  if (!cookies) return [];

  return Array.isArray(cookies) ? cookies : [cookies];
};

const login = async (app: express.Application) => {
  const response = await request(app).post('/auth/login').send({ username: USER.username, password: USER.password });

  return { accessToken: response.body.accessToken as string, refreshCookies: getSetCookies(response), response };
};

const logout = (app: express.Application, accessToken: string, cookies?: string[]) =>
  request(app)
    .post('/auth/logout')
    .set('Authorization', `Bearer ${accessToken}`)
    .set('Cookie', cookies ?? []);

const refresh = (app: express.Application, cookies?: string[]) =>
  request(app)
    .post('/auth/refresh')
    .set('Cookie', cookies ?? []);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await createMongoMemoryServer();

  await connectToMongoMemoryServer(mongoServer);
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

afterEach(async () => {
  await userModel.deleteMany();
});

describe('Auth Controller', () => {
  let app: express.Application;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/auth', authRouter);

    userService = new UserService();
    authService = new AuthService();

    await userService.createSingle({
      _id: new Types.ObjectId(USER.id),
      username: USER.username,
      password: USER.password,
      email: USER.email,
      isPrivate: false,
      bio: 'bio',
    });
  });

  describe('POST /auth/login', () => {
    it('logs in and sets refresh cookie', async () => {
      const { response } = await login(app);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.accessToken).toBeDefined();
      expect(getSetCookies(response)[0]).toContain('refreshToken=');
    });

    it('fails for invalid credentials', async () => {
      const response = await request(app).post('/auth/login').send({
        username: USER.username,
        password: 'wrong-password',
      });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /auth/logout', () => {
    it('logs out successfully', async () => {
      const { accessToken, refreshCookies } = await login(app);

      const response = await logout(app, accessToken, refreshCookies);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.message).toBe('Logged out successfully');
    });

    it('returns 204 when refresh token is missing', async () => {
      const accessToken = authService.generateAccessToken({
        userId: new Types.ObjectId(USER.id),
      });

      const response = await logout(app, accessToken);

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    it('returns 400 for invalid userId format', async () => {
      const accessToken = authService.generateAccessToken({
        userId: INVALID_ID as unknown as Types.ObjectId,
      });

      const response = await logout(app, accessToken, ['refreshToken=123']);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /auth/refresh', () => {
    it('rotates refresh token and returns new access token', async () => {
      const { refreshCookies } = await login(app);

      const response = await refresh(app, refreshCookies);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.newAccessToken).toBeDefined();
      expect(getSetCookies(response)[0]).toContain('refreshToken=');
    });

    it('fails when refresh token is missing', async () => {
      const response = await refresh(app);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('fails for invalid refresh token', async () => {
      const response = await refresh(app, ['refreshToken=invalid.token']);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
