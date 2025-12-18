import cors from 'cors';
import { Express, json } from 'express';
import morgan from 'morgan';

export const initializeAppConfig = (app: Express) => {
  app.use(json());
  app.use(cors());
  app.use(morgan('dev'));
};
