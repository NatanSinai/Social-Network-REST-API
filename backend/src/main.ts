import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { readFileSync } from 'fs';
import https from 'https';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import {
  connectToMongoDB,
  envVar,
  errorHandler,
  initializeAppConfig,
  initializeExampleComment,
  initializeExamplePost,
  initializeExampleUser,
  initializeRouters,
} from './utils';

dotenv.config();

export const app = express();

const initializeServer = async () => {
  console.log('\n========== STARTING TO INITIALIZE SERVER ==========\n');

  await connectToMongoDB();
  await initializeExamplePost();
  await initializeExampleComment();
  await initializeExampleUser();

  initializeAppConfig(app);
  app.use(cookieParser());
  initializeRouters(app);

  app.use(errorHandler);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const { PORT: port, NODE_ENV, BASE_URL } = envVar;

  if (NODE_ENV === 'production') {
    const httpsOptions = {
      key: readFileSync('../../client-key.pem'),
      cert: readFileSync('../../client-cert.pem'),
    };

    https.createServer(httpsOptions, app).listen(port, () => {
      console.log(`\nSecure HTTPS API listening on '${BASE_URL}'`);
      console.log(`\nSwagger documentation running on '${BASE_URL}/api-docs'`);
      console.log('\n========== FINISHED INITIALIZING SERVER ==========\n');
    });
  } else
    app.listen(port, (error) => {
      if (error) return console.error({ error });

      console.log(`\nCRUD API listening on '${BASE_URL}'`);
      console.log(`\nSwagger documentation running on '${BASE_URL}/api-docs'`);
      console.log('\n========== FINISHED INITIALIZING SERVER ==========\n');
    });
};

if (require.main === module) initializeServer();
