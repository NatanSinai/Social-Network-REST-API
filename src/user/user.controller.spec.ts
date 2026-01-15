import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { connectToMongoMemoryServer, createMongoMemoryServer } from '@utils';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import AuthService from '../auth/auth.service';
import usersRouter from './user.controller';
import userModel from './user.model';
import UserService from './user.service';
import type { CreateUserDTO, UpdateUserDTO } from './user.types';

const VALID_USER_ID = '507f1f77bcf86cd799439011';
const INVALID_ID = 'invalid-id-123';
const NON_EXISTENT_ID = '507f1f77bcf86cd799439099';

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

describe('User Controller', () => {
  let app: express.Application;
  let accessToken: string;

  const userService = new UserService();
  const authService = new AuthService();

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/users', usersRouter);
  });

  describe('GET /users/:userId', () => {
    it('should return a user by id', async () => {
      const createUserDTO: CreateUserDTO = {
        _id: new Types.ObjectId(VALID_USER_ID),
        username: 'John Doe',
        password: '12345',
        email: 'john@example.com',
        isPrivate: false,
        bio: 'Hello world',
      };

      const user = await userService.createSingle(createUserDTO);

      const response = await request(app).get(`/users/${VALID_USER_ID}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        _id: VALID_USER_ID,
        username: createUserDTO.username,
        password: user.password,
        email: createUserDTO.email,
        isPrivate: createUserDTO.isPrivate,
        bio: createUserDTO.bio,
      });
    });

    it('should return 404 if user does not exist', async () => {
      const response = await request(app).get(`/users/${NON_EXISTENT_ID}`);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body.message).toBe(`There is no user with id '${NON_EXISTENT_ID}'`);
    });

    it('should return 400 for invalid userId format', async () => {
      const response = await request(app).get(`/users/${INVALID_ID}`);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.message).toBe(`Invalid user id: '${INVALID_ID}'`);
    });

    it('should return 404 when userId is missing', async () => {
      const response = await request(app).get('/users/');

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('PUT /users/:userId', () => {
    it('should update user information', async () => {
      const user = await userService.createSingle({
        _id: new Types.ObjectId(VALID_USER_ID),
        username: 'Original Username',
        password: '11111',
        email: 'test@test.com',
        isPrivate: false,
        bio: 'Old bio',
      });

      accessToken = authService.generateAccessToken({ userId: user._id });

      const updateDTO: UpdateUserDTO = { username: 'Updated Username', bio: 'New bio' };

      const response = await request(app)
        .put(`/users/${VALID_USER_ID}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDTO);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.username).toBe(updateDTO.username);
      expect(response.body.bio).toBe(updateDTO.bio);
    });

    it('should return 404 when updating non-existent user', async () => {
      accessToken = authService.generateAccessToken({ userId: new Types.ObjectId(NON_EXISTENT_ID) });

      const response = await request(app)
        .put(`/users/${NON_EXISTENT_ID}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Fail' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user and return the deleted document', async () => {
      const user = await userService.createSingle({
        _id: new Types.ObjectId(VALID_USER_ID),
        username: 'To Be Deleted',
        password: '11111',
        email: 'delete@test.com',
        isPrivate: false,
        bio: 'Bye',
      });

      accessToken = authService.generateAccessToken({ userId: user._id });

      const response = await request(app)
        .delete(`/users/${VALID_USER_ID}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body._id).toBe(VALID_USER_ID);

      const exists = await userModel.findById(VALID_USER_ID);
      expect(exists).toBeNull();
    });

    it('should return 400 for invalid id on deletion', async () => {
      accessToken = authService.generateAccessToken({ userId: INVALID_ID as unknown as Types.ObjectId });

      const response = await request(app).delete(`/users/${INVALID_ID}`).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return 404 when deleting non-existent user', async () => {
      accessToken = authService.generateAccessToken({ userId: new Types.ObjectId(NON_EXISTENT_ID) });

      const response = await request(app)
        .delete(`/users/${NON_EXISTENT_ID}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
