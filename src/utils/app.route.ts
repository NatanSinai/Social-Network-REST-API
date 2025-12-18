import { Router } from 'express';

// Base route
export const appRouter = Router();

appRouter.get('', (req, res) => {
  const version = process.env.npm_package_version ?? '1.0.0';

  res.send(`Welcome to NASH API (v${version})`);
});
