import CommentService from '@comment/comment.service';
import PostService from '@post/post.service';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { json, type CookieOptions, type ErrorRequestHandler, type Express, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { Types } from 'mongoose';
import morgan from 'morgan';
import { envVar, getNodeEnvironment, type CookieName } from '.';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error: Error, request, response, next) => {
  console.log(`Error in ${request.method} request to ${request}:`);
  console.error(error);

  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
};

export const initializeAppConfig = (app: Express) => {
  app.use(json());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(cookieParser());
};

export const initializeExamplePost = async () => {
  const { EXAMPLE_POST_ID, EXAMPLE_SENDER_ID } = envVar;

  const postService = new PostService();

  const isExamplePostExists = await postService.exists({ _id: EXAMPLE_POST_ID });

  if (isExamplePostExists) return;

  const examplePost = await postService.createSingle({
    title: 'Title Example',
    content: 'Content Example',
    senderId: EXAMPLE_SENDER_ID as unknown as Types.ObjectId, // This has to be string, but the type is ObjectId
    _id: EXAMPLE_POST_ID as unknown as Types.ObjectId, // This has to be string, but the type is ObjectId
  });

  console.log(`Created example post with id '${examplePost._id}'\n`);
};

export const initializeExampleComment = async () => {
  const { EXAMPLE_COMMENT_ID, EXAMPLE_POST_ID, EXAMPLE_SENDER_ID } = envVar;

  const commentService = new CommentService();

  const isExampleCommentExists = await commentService.exists({ _id: EXAMPLE_COMMENT_ID });

  if (isExampleCommentExists) return;

  const exampleComment = await commentService.createSingle({
    content: 'Comment Example',
    postId: EXAMPLE_POST_ID as unknown as Types.ObjectId, // This has to be string, but the type is ObjectId
    senderId: EXAMPLE_SENDER_ID as unknown as Types.ObjectId, // This has to be string, but the type is ObjectId
    _id: EXAMPLE_COMMENT_ID as unknown as Types.ObjectId, // This has to be string, but the type is ObjectId
  });

  console.log(`Created example comment with id '${exampleComment._id}'\n`);
};

export const respondWithJSONMessage = (response: Response, message: string) => response.json({ message });

const respondWithStatusAndJSONMessage = (status: StatusCodes) => (response: Response, message: string) =>
  response.status(status).json({ message });

export const respondWithForbidden = respondWithStatusAndJSONMessage(StatusCodes.FORBIDDEN);

export const respondWithUnauthorized = respondWithStatusAndJSONMessage(StatusCodes.UNAUTHORIZED);

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
