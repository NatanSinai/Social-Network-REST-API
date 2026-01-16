import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { connectToMongoMemoryServer, createMongoMemoryServer } from '@utils';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import AuthService from '../auth/auth.service';
import postModel from '../post/post.model';
import PostService from '../post/post.service';
import userModel from '../user/user.model';
import UserService from '../user/user.service';
import commentsRouter from './comment.controller';
import commentModel from './comment.model';
import CommentService from './comment.service';
import type { CreateCommentDTO, UpdateCommentDTO } from './comment.types';

const VALID_POST_ID = '507f1f77bcf86cd799439011';
const VALID_SENDER_ID = '507f1f77bcf86cd799439012';
const INVALID_ID = 'invalid';
const NON_EXISTENT_ID = '507f1f77bcf86cd799439013';

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
  await commentModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();
});

describe('Comment Controller', () => {
  let app: express.Application;
  let accessToken: string;

  const userService = new UserService();
  const postService = new PostService();
  const commentService = new CommentService();
  const authService = new AuthService();

  beforeEach(async () => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/comments', commentsRouter);

    const user = await userService.createSingle({
      _id: new Types.ObjectId(VALID_SENDER_ID),
      username: 'Test User',
      password: '123456',
      email: 'test@user.com',
      isPrivate: false,
      bio: 'Bio',
    });

    accessToken = authService.generateAccessToken({ userId: user._id });

    await postService.createSingle({
      _id: new Types.ObjectId(VALID_POST_ID),
      title: 'Test Post',
      content: 'Content',
      senderId: new Types.ObjectId(VALID_SENDER_ID),
    });
  });

  describe('POST /comments', () => {
    it('should create a comment and return it', async () => {
      const commentDTO: Omit<CreateCommentDTO, 'senderId'> = {
        content: 'Test Comment',
        postId: new Types.ObjectId(VALID_POST_ID),
      };

      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentDTO);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.content).toBe(commentDTO.content);
      expect(response.body.senderId).toBe(VALID_SENDER_ID);
    });

    it('should return 404 if the user (sender) does not exist', async () => {
      const commentDTO: Omit<CreateCommentDTO, 'senderId'> = {
        content: 'Test',
        postId: new Types.ObjectId(VALID_POST_ID),
      };

      const nonExistingUserAccessToken = authService.generateAccessToken({
        userId: new Types.ObjectId(NON_EXISTENT_ID),
      });

      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${nonExistingUserAccessToken}`)
        .send(commentDTO);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 404 if the post does not exist', async () => {
      const commentDTO: Omit<CreateCommentDTO, 'senderId'> = {
        content: 'Test',
        postId: new Types.ObjectId(NON_EXISTENT_ID),
      };

      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentDTO);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 400 for invalid postId format', async () => {
      const commentDTO: Omit<CreateCommentDTO, 'senderId'> = {
        content: 'Test',
        postId: INVALID_ID as unknown as Types.ObjectId,
      };

      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentDTO);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('should return 401 for invalid senderId format', async () => {
      const commentDTO: Omit<CreateCommentDTO, 'senderId'> = {
        content: 'Test',
        postId: new Types.ObjectId(VALID_POST_ID),
      };

      const response = await request(app)
        .post('/comments')
        .set('Authorization', `Bearer ${accessToken.slice(0, accessToken.length - 2)}`)
        .send(commentDTO);
      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('GET /comments', () => {
    it('should return all comments', async () => {
      await commentService.createSingle({
        content: 'Comment1',
        postId: new Types.ObjectId(VALID_POST_ID),
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const response = await request(app).get('/comments');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveLength(1);
    });

    it('should return an empty array if no comments exist', async () => {
      const response = await request(app).get('/comments');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('PUT /comments/:commentId', () => {
    it('should update a comment', async () => {
      const comment = await commentService.createSingle({
        content: 'Old Content',
        postId: new Types.ObjectId(VALID_POST_ID),
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const updateDTO: UpdateCommentDTO = { content: 'New Content' };
      const response = await request(app)
        .put(`/comments/${comment._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDTO);

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.content).toBe(updateDTO.content);
    });

    it('should return 404 if the comment does not exist', async () => {
      const updateDTO: UpdateCommentDTO = { content: 'New Content' };
      const response = await request(app)
        .put(`/comments/${NON_EXISTENT_ID}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDTO);

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it('should return 400 for invalid commentId format', async () => {
      const updateDTO: UpdateCommentDTO = { content: 'New Content' };
      const response = await request(app)
        .put(`/comments/${INVALID_ID}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateDTO);

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('DELETE /comments/:commentId', () => {
    it('should delete a comment by id', async () => {
      const comment = await commentService.createSingle({
        content: 'Delete Me',
        postId: new Types.ObjectId(VALID_POST_ID),
        senderId: new Types.ObjectId(VALID_SENDER_ID),
      });

      const response = await request(app)
        .delete(`/comments/${comment._id}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(StatusCodes.OK);

      const exists = await commentModel.findById(comment._id);
      expect(exists).toBeNull();
    });

    it('should return 404 when trying to delete a non-existent comment', async () => {
      const response = await request(app)
        .delete(`/comments/${NON_EXISTENT_ID}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
