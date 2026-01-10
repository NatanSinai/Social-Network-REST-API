import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { connectToMongoDB } from '@utils';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import usersRouter from './user.controller';
import userModel from './user.model';
import UserService from './user.service';
import type { CreateUserDTO, UpdateUserDTO } from './user.types';

const VALID_USER_ID = '507f1f77bcf86cd799439011';
const INVALID_ID = 'invalid-id-123';
const NON_EXISTENT_ID = '507f1f77bcf86cd799439099';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_CONNECTION_STRING = mongoServer.getUri();
  await connectToMongoDB();
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

afterEach(async () => {
  await userModel.deleteMany({});
});

describe('User Controller', () => {
  let app: express.Application;
  const userService = new UserService();

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/users', usersRouter);
  });

  describe('GET /users/:userId', () => {
    it('should return a user by id', async () => {
      const userDTO: CreateUserDTO = {
        _id: new Types.ObjectId(VALID_USER_ID),
        name: 'John Doe',
        email: 'john@example.com',
        isPrivate: false,
        postsCount: 0,
        bio: 'Hello world',
      };

      await userService.createSingle(userDTO);

      const response = await request(app).get(`/users/${VALID_USER_ID}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toMatchObject({
        _id: VALID_USER_ID,
        name: userDTO.name,
        email: userDTO.email,
        isPrivate: userDTO.isPrivate,
        postsCount: userDTO.postsCount,
        bio: userDTO.bio,
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
  });

  describe('PUT /users/:userId', () => {
    it('should update user information', async () => {
      await userService.createSingle({
        _id: new Types.ObjectId(VALID_USER_ID),
        name: 'Original Name',
        email: 'test@test.com',
        isPrivate: false,
        postsCount: 0,
        bio: 'Old bio',
      });

      const updateDTO: UpdateUserDTO = { name: 'Updated Name', bio: 'New bio' };

      const response = await request(app).put(`/users/${VALID_USER_ID}`).send(updateDTO);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.name).toBe(updateDTO.name);
      expect(response.body.bio).toBe(updateDTO.bio);
    });

    it('should return 404 when updating non-existent user', async () => {
      const response = await request(app).put(`/users/${NON_EXISTENT_ID}`).send({ name: 'Fail' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should delete a user and return the deleted document', async () => {
      await userService.createSingle({
        _id: new Types.ObjectId(VALID_USER_ID),
        name: 'To Be Deleted',
        email: 'delete@test.com',
        isPrivate: false,
        postsCount: 0,
        bio: 'Bye',
      });

      const response = await request(app).delete(`/users/${VALID_USER_ID}`);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body._id).toBe(VALID_USER_ID);

      const exists = await userModel.findById(VALID_USER_ID);
      expect(exists).toBeNull();
    });

    it('should return 400 for invalid id on deletion', async () => {
      const response = await request(app).delete(`/users/${INVALID_ID}`);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
