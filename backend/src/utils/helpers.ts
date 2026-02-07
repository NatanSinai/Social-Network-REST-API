import CommentService from '@comment/comment.service';
import PostService from '@post/post.service';
import UserService from '@user/user.service';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
  json,
  type Application,
  type CookieOptions,
  type ErrorRequestHandler,
  type Express,
  type Response,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Types } from 'mongoose';
import morgan from 'morgan';
import request from 'supertest';
import { connectToMongoDB, envVar, getNodeEnvironment, type CookieName, type NoAuthorizationReason } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error: Error, request, response, next) => {
  console.log(`Error in ${request.method} request to ${request.url}:`);
  console.error(error);

  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
};

export const initializeAppConfig = (app: Express) => {
  app.use(json());
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }),
  );
  app.use(morgan('dev'));
  app.use(cookieParser());
};

const { EXAMPLE_COMMENT_ID, EXAMPLE_POST_ID, EXAMPLE_SENDER_ID } = envVar;
const exampleCommentId = EXAMPLE_COMMENT_ID as unknown as Types.ObjectId; // This has to be string, but the type is ObjectId
const examplePostId = EXAMPLE_POST_ID as unknown as Types.ObjectId; // This has to be string, but the type is ObjectId
const exampleSenderId = EXAMPLE_SENDER_ID as unknown as Types.ObjectId; // This has to be string, but the type is ObjectId

export const initializeExamplePost = async () => {
  const postService = new PostService();

  const isExamplePostExists = await postService.existsById(examplePostId);

  if (isExamplePostExists) return;

  const examplePost = await postService.createSingle({
    title: 'Title Example',
    content: 'Content Example',
    senderId: exampleSenderId,
    _id: examplePostId,
  });

  console.log(`Created example post with id '${examplePost._id}'\n`);
};

export const initializeExampleComment = async () => {
  const commentService = new CommentService();

  const isExampleCommentExists = await commentService.existsById(exampleCommentId);

  if (isExampleCommentExists) return;

  const exampleComment = await commentService.createSingle({
    content: 'Comment Example',
    postId: examplePostId,
    senderId: exampleSenderId,
    _id: exampleCommentId,
  });

  console.log(`Created example comment with id '${exampleComment._id}'\n`);
};

export const initializeExampleUser = async () => {
  const userService = new UserService();

  const isExampleUserExists = await userService.existsById(exampleSenderId);

  if (isExampleUserExists) return;

  const exampleUser = await userService.createSingle({
    _id: exampleSenderId,
    username: 'example_user',
    password: '1234567',
    email: 'example@nashdb.com',
    isPrivate: true,
    postsCount: 1,
    bio: 'This is an example user',
  });

  console.log(`Created example user with id '${exampleUser._id}'\n`);
};

export const respondWithJSONMessage = (response: Response, message: string) => response.json({ message });

const respondWithStatusAndJSONMessage =
  (status: StatusCodes) =>
  (response: Response, message: string, ...jsonValues: Record<string, unknown>[]) => {
    const additionalJSONValues = jsonValues.reduce((allValues, current) => ({ ...allValues, ...current }), {});

    return response.status(status).json({ message, ...additionalJSONValues });
  };

export const respondWithNoContent = respondWithStatusAndJSONMessage(StatusCodes.NO_CONTENT);

export const respondWithForbidden = respondWithStatusAndJSONMessage(StatusCodes.FORBIDDEN);

export const respondWithUnauthorized = (
  response: Response,
  message: string,
  reason: NoAuthorizationReason,
  ...jsonValues: Record<string, unknown>[]
) => respondWithStatusAndJSONMessage(StatusCodes.UNAUTHORIZED)(response, message, { reason }, ...jsonValues);

export const respondWithBadRequest = respondWithStatusAndJSONMessage(StatusCodes.BAD_REQUEST);

export const respondWithInvalidId = (id: unknown, response: Response, idName?: string) => {
  const idLabel = `${idName ? idName + ' ' : ''}id`;
  const message = `Invalid ${idLabel}: '${id}'`;

  return respondWithBadRequest(response, message);
};

export const respondWithNotFound = respondWithStatusAndJSONMessage(StatusCodes.NOT_FOUND);

export const respondWithNotFoundById = (id: Types.ObjectId, response: Response, entityName: string) =>
  respondWithNotFound(response, `There is no ${entityName} with id '${id}'`);

export const addCookieToResponse = ({
  response,
  cookieName,
  cookieValue,
  ...cookieOptions
}: CookieOptions & {
  response: Response;
  cookieName: CookieName;
  cookieValue: string;
}) => {
  const nodeEnvironment = getNodeEnvironment();

  response.cookie(cookieName, cookieValue, {
    httpOnly: true,
    secure: nodeEnvironment === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    ...cookieOptions,
  });
};

export const createSendAuthorizedRequest =
  (app: Application, accessToken: string) => (method: 'get' | 'post' | 'put' | 'delete', url: string) =>
    request(app)[method](url).set('Authorization', `Bearer ${accessToken}`);

export const createMongoMemoryServer = () => MongoMemoryServer.create({ binary: { version: '6.0.5' } });

export const connectToMongoMemoryServer = async (mongoServer: MongoMemoryServer) => {
  envVar.MONGO_CONNECTION_STRING = mongoServer.getUri();

  await connectToMongoDB();
};
