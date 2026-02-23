import UserService from '@user/user.service';
import { envVar, respondWithInvalidId, respondWithNotFoundById, respondWithStatusAndJSONMessage } from '@utils';
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const userService = new UserService();

export const aiCooldownMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  const { userId } = request;

  if (!userId) return respondWithInvalidId(userId, response, 'user');

  const user = await userService.getById(userId);

  if (!user) return respondWithNotFoundById(userId, response, 'user');

  const now = Date.now();
  const lastAction = new Date(user.lastAIAction || 0).getTime();

  if (now - lastAction < envVar.AI_GENERATION_COOLDOWN_MS) {
    const remaining = Math.ceil((envVar.AI_GENERATION_COOLDOWN_MS - (now - lastAction)) / 1000);

    return respondWithStatusAndJSONMessage(StatusCodes.TOO_MANY_REQUESTS)(
      response,
      `AI on cooldown. Wait ${remaining}s.`,
    );
  }

  await userService.updateById(userId, { lastAIAction: new Date() });

  next();
};
