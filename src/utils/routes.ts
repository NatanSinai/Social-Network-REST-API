import { postsRouter } from '@post';
import { Express, Router } from 'express';

const routePathToRouter = { post: postsRouter } satisfies Record<string, Router>;

export const initializeRouters = (app: Express) => {
  const routePathToRouterEntries = Object.entries(routePathToRouter);

  console.log(`Listening to ${routePathToRouterEntries.length} routes:`);

  routePathToRouterEntries.forEach(([routePath, router], index) => {
    const relativeRoutePath = `/${routePath}`;

    app.use(relativeRoutePath, router);
    console.log(`${index + 1}) ${relativeRoutePath}`);
  });

  // Base route
  app.get('/', (req, res) => {
    const version = process.env.npm_package_version ?? '1.0.0';

    res.send(`Welcome to the NASH API (v${version})`);
  });
};
