import { connectToMongoDB, errorHandler, initializeAppConfig, initializeRouters } from '@utils';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

const initializeServer = async () => {
  console.log('\n========== STARTING TO INITIALIZE SERVER ==========\n');

  await connectToMongoDB();

  initializeAppConfig(app);
  initializeRouters(app);
  app.use(errorHandler);

  const port = process.env.PORT ?? '3000';

  app.listen(port, (error) => {
    if (error) return console.error({ error });

    console.log(`\nCRUD API listening on http://localhost:${port}`);
    console.log('\n========== FINISHED INITIALIZING SERVER ==========\n');
  });
};

initializeServer();
