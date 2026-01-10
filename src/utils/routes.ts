import commentsRouter from '@comment/comment.controller';
import postsRouter from '@post/post.controller';
import usersRouter from '@user/user.controller';
import { type Express, Router } from 'express';
import { appRouter } from './app.controller';

const routePathToRouter = {
  ['']: appRouter,
  posts: postsRouter,
  comments: commentsRouter,
  users: usersRouter,
} satisfies Record<string, Router>;

export const initializeRouters = (app: Express) => {
  const routePathToRouterEntries = Object.entries(routePathToRouter);

  console.log(`Listening to ${routePathToRouterEntries.length} routes:`);

  routePathToRouterEntries.forEach(([routePath, router], index) => {
    const relativeRoutePath = `/${routePath}`;

    app.use(relativeRoutePath, router);
    console.log(`${index + 1}) ${relativeRoutePath}`);
  });
};
