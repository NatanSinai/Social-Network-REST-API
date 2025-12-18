import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('', (req, res) => {
  res.send('hi');
});

export default usersRouter;
