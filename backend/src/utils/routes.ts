import authRouter from '@/auth/auth.controller';
import commentsRouter from '@comment/comment.controller';
import postsRouter from '@post/post.controller';
import usersRouter from '@user/user.controller';
import { type Express, type RequestHandler, Router, static as staticController } from 'express';
import { appRouter } from './app.controller';
import { envVar } from './env';

const routePathToRouter = {
  ['']: appRouter,
  posts: postsRouter,
  comments: commentsRouter,
  users: usersRouter,
  auth: authRouter,
  uploads: staticController(envVar.FILE_UPLOADS_BASE_PATH),
} satisfies Record<string, Router | RequestHandler>;

export const initializeRouters = (app: Express) => {
  const routePathToRouterEntries = Object.entries(routePathToRouter);

  console.log(`Listening to ${routePathToRouterEntries.length} routes:`);

  routePathToRouterEntries.forEach(([routePath, router], index) => {
    const relativeRoutePath = `/${routePath}`;

    app.use(relativeRoutePath, router);
    console.log(`${index + 1}) ${relativeRoutePath}`);
  });
};
