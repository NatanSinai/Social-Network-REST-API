import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import https from 'https';
import fs from 'fs';
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
  console.log('\n========== STARTING HTTPS SERVER ==========\n');

  await connectToMongoDB();
  await initializeExamplePost();
  await initializeExampleComment();
  await initializeExampleUser();

  initializeAppConfig(app);
  app.use(cookieParser());
  initializeRouters(app);

  app.use(errorHandler);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const { PORT: port } = envVar;

  // SSL Options - Point these to your actual file locations
  const httpsOptions = {
    key: fs.readFileSync('../../client-key.pem'),
    cert: fs.readFileSync('../../client-cert.pem')
  };

  https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`\nSecure API listening on 'https://localhost:${port}'`);
    console.log('\n========== FINISHED INITIALIZING SERVER ==========\n');
  });
};

if (require.main === module) initializeServer();
