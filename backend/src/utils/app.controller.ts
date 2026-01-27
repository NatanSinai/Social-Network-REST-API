import { Router } from 'express';
import { envVar } from '.';

export const appRouter = Router();

appRouter.get('', (request, response) => {
  const version = envVar.npm_package_version;

  response.send(`Welcome to NASH API (v${version})`);
});
