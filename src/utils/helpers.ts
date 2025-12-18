import cors from 'cors';
import { Express, json, type ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (error: Error, request, response, next) => {
  console.log(`Error in ${request.method} request to ${request.path}:`);
  console.error(error);

  response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
};

export const initializeAppConfig = (app: Express) => {
  app.use(json());
  app.use(cors());
  app.use(morgan('dev'));
};
