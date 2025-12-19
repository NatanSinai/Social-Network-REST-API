import {
  connectToMongoDB,
  envVar,
  errorHandler,
  initializeAppConfig,
  initializeExamplePost,
  initializeRouters,
} from '@utils';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

const initializeServer = async () => {
  console.log('\n========== STARTING TO INITIALIZE SERVER ==========\n');

  await connectToMongoDB();

  initializeAppConfig(app);
  initializeRouters(app);
  await initializeExamplePost();

  app.use(errorHandler);

  const port = envVar.PORT;

  app.listen(port, (error) => {
    if (error) return console.error({ error });

    console.log(`\nCRUD API listening on http://localhost:${port}`);
    console.log('\n========== FINISHED INITIALIZING SERVER ==========\n');
  });
};

initializeServer();
