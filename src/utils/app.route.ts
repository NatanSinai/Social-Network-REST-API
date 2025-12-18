import { Router } from 'express';

export const appRouter = Router();

appRouter.get('', (request, response) => {
  const version = process.env.npm_package_version ?? '1.0.0';

  response.send(`Welcome to NASH API (v${version})`);
});
