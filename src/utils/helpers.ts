import { postModel } from '@post';
import cors from 'cors';
import { Express, json, type ErrorRequestHandler, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type ObjectId } from 'mongoose';
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

  const isExamplePostExists = await postModel.exists({ _id: EXAMPLE_POST_ID });

  if (isExamplePostExists) return;

  const examplePost = await postModel.create({
    title: 'Title Example',
    content: 'Content Example',
    senderId: EXAMPLE_SENDER_ID as unknown as ObjectId, // This has to be string, but the type is ObjectId
    _id: EXAMPLE_POST_ID,
  });

  console.log(`\nCreated example post with id '${examplePost._id}'`);
};

export const respondWithInvalidId = (id: unknown, response: Response, idName?: string) => {
  const idLabel = `${idName ? idName + ' ' : ''}id`;

  response.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid ${idLabel}: '${id}'` });
};
