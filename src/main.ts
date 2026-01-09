import {
  connectToMongoDB,
  envVar,
  errorHandler,
  initializeAppConfig,
  initializeExampleComment,
  initializeExamplePost,
  initializeExampleUser,
  initializeRouters,
} from '@utils';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

const initializeServer = async () => {
  console.log('\n========== STARTING TO INITIALIZE SERVER ==========\n');

  await connectToMongoDB();
  await initializeExamplePost();
  await initializeExampleComment();
  await initializeExampleUser();

  initializeAppConfig(app);
  initializeRouters(app);

  app.use(errorHandler);

  const port = envVar.PORT;

  app.listen(port, (error) => {
    if (error) return console.error({ error });

    console.log(`\nCRUD API listening on 'http://localhost:${port}'`);
    console.log('\n========== FINISHED INITIALIZING SERVER ==========\n');
  });
};

initializeServer();
