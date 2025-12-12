import cors from 'cors';
import { Express, json } from 'express';

export const initializeAppConfig = (app: Express) => {
  app.use(json());
  app.use(cors());
};
