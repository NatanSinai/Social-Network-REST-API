import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { connectToMongoDB, envVar } from '@utils';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import AuthService from '../auth/auth.service';
import userModel from '../user/user.model';
import UserService from '../user/user.service';
import postsRouter from './post.controller';
import postModel from './post.model';
import PostService from './post.service';
import type { CreatePostDTO, UpdatePostDTO } from './post.types';

const VALID_SENDER_ID = '507f1f77bcf86cd799439011';
const INVALID_ID = 'invalid';
const NON_EXISTENT_ID = '507f1f77bcf86cd799439012';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  envVar.MONGO_CONNECTION_STRING = mongoServer.getUri();

  await connectToMongoDB();
});

afterAll(async () => {
  await mongoServer.stop();
  await mongoose.connection.close();
});

afterEach(async () => {
  await postModel.deleteMany();
  await userModel.deleteMany();
});

describe('Post Controller', () => {
  let app: express.Application;
  let accessToken: string;

  const userService = new UserService();
  const postService = new PostService();
  const authService = new AuthService();

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use('/posts', postsRouter);

    const user = await userService.createSingle({
      _id: new Types.ObjectId(VALID_SENDER_ID),
      username: 'Author',
      password: '123456',
      email: 'author@test.com',
      isPrivate: false,
      postsCount: 0,
      bio: 'Bio',
    });

    accessToken = authService.generateAccessToken({ userId: user._id });
  });

  describe('POST /posts', () => {
    it('should create a post if user exists', async () => {
      const createPostDTO: Omit<CreatePostDTO, 'senderId'> = { title: 'Test Title', content: 'Test Content' };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDTO);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.title).toBe(createPostDTO.title);
    });

    it('should return 404 if senderId does not exist in database', async () => {
      const createPostDTO: Omit<CreatePostDTO, 'senderId'> = { title: 'Title', content: 'Content' };

      const nonExistingUserAccessToken = authService.generateAccessToken({
        userId: new Types.ObjectId(NON_EXISTENT_ID),
      });

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${nonExistingUserAccessToken}`)
        .send(createPostDTO);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 401 for invalid senderId format', async () => {
      const createPostDTO: Omit<CreatePostDTO, 'senderId'> = { title: 'Title', content: 'Content' };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken.slice(0, accessToken.length - 2)}`)
        .send(createPostDTO);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /posts/:postId', () => {
    it('should return a post by id', async () => {
      const post = await postService.createSingle({
        title: 'Single Post',
        content: 'Content',
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const response = await request(app).get(`/posts/${post._id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body._id).toBe(post._id.toString());
    });

    it('should return 404 if post does not exist', async () => {
      const response = await request(app).get(`/posts/${NON_EXISTENT_ID}`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 400 for invalid postId format', async () => {
      const response = await request(app).get(`/posts/${INVALID_ID}`);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return empty array when no posts exist', async () => {
      const response = await request(app).get('/posts');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('PUT /posts/:postId', () => {
    it('should update a post', async () => {
      const post = await postService.createSingle({
        title: 'Old Title',
        content: 'Content',
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const updateDTO: UpdatePostDTO = { title: 'New Title' };
      const response = await request(app)
        .put(`/posts/${post._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDTO);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.title).toBe('New Title');
    });

    it('should return 404 if updating with a non-existent senderId', async () => {
      const post = await postService.createSingle({
        title: 'Title',
        content: 'Content',
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const nonExistingUserAccessToken = authService.generateAccessToken({
        userId: new Types.ObjectId(NON_EXISTENT_ID),
      });

      const response = await request(app)
        .put(`/posts/${post._id}`)
        .set('Authorization', `Bearer ${nonExistingUserAccessToken}`)
        .send({ title: 'title 2' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('DELETE /posts/:postId', () => {
    it('should delete a post', async () => {
      const post = await postService.createSingle({
        title: 'Delete',
        content: 'Content',
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const response = await request(app).delete(`/posts/${post._id}`).set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(StatusCodes.OK);

      const remains = await postModel.findById(post._id);
      expect(remains).toBeNull();
    });

    it('should return 404 when trying to delete a non-existent post', async () => {
      const response = await request(app)
        .delete(`/posts/${NON_EXISTENT_ID}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
