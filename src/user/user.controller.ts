import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('', (request, response) => {
  response.send('WIP');
});

export default usersRouter;
