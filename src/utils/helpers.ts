import { commentModel } from '@comment';
import PostService from '@post/post.service';
import cors from 'cors';
import { json, type ErrorRequestHandler, type Express, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { ObjectId, Types } from 'mongoose';
import morgan from 'morgan';
import { envVar } from '.';

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
};

export const initializeExamplePost = async () => {
  const { EXAMPLE_POST_ID, EXAMPLE_SENDER_ID } = envVar;

  const postService = new PostService();

  const isExamplePostExists = await postService.exists({ _id: EXAMPLE_POST_ID });

  if (isExamplePostExists) return;

  const examplePost = await postService.createSingle({
    title: 'Title Example',
    content: 'Content Example',
    senderId: EXAMPLE_SENDER_ID as unknown as ObjectId, // This has to be string, but the type is ObjectId
    _id: EXAMPLE_POST_ID as unknown as Types.ObjectId, // This has to be string, but the type is ObjectId
  });

  console.log(`Created example post with id '${examplePost._id}'\n`);
};

export const initializeExampleComment = async () => {
  const { EXAMPLE_COMMENT_ID, EXAMPLE_POST_ID, EXAMPLE_SENDER_ID } = envVar;

  const isExampleCommentExists = await commentModel.exists({ _id: EXAMPLE_COMMENT_ID });

  if (isExampleCommentExists) return;

  const exampleComment = await commentModel.create({
    content: 'Comment Example',
    postId: EXAMPLE_POST_ID as unknown as ObjectId,
    senderId: EXAMPLE_SENDER_ID as unknown as ObjectId,
    _id: EXAMPLE_COMMENT_ID,
  });

  console.log(`Created example comment with id '${exampleComment._id}'\n`);
};

export const respondWithInvalidId = (id: unknown, response: Response, idName?: string) => {
  const idLabel = `${idName ? idName + ' ' : ''}id`;

  response.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid ${idLabel}: '${id}'` });
};

export const respondWithNotFound = (id: Types.ObjectId, response: Response, entityName: string) =>
  response.status(StatusCodes.NOT_FOUND).json({ message: `There is no ${entityName} with id '${id}'` });
