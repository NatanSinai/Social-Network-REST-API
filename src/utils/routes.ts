import { postsRouter } from '@post';
import { type Express, Router } from 'express';
import { appRouter } from './app.route';

const routePathToRouter = { ['']: appRouter, post: postsRouter } satisfies Record<string, Router>;

export const initializeRouters = (app: Express) => {
  const routePathToRouterEntries = Object.entries(routePathToRouter);

  console.log(`Listening to ${routePathToRouterEntries.length} routes:`);

  routePathToRouterEntries.forEach(([routePath, router], index) => {
    const relativeRoutePath = `/${routePath}`;

    app.use(relativeRoutePath, router);
    console.log(`${index + 1}) ${relativeRoutePath}`);
  });
};
