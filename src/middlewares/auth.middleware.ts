import type { User } from '@user/user.types';
import { envVar, respondWithForbidden, respondWithUnauthorized } from '@utils';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';

const authMiddleware =
  <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = Query>() =>
  (request: Request<P, ResBody, ReqBody, ReqQuery>, response: Response<ResBody>, next: NextFunction) => {
    const { JWT_SECRET } = envVar;

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return respondWithForbidden(response, 'No access token provided');

    try {
      const { _id } = verify(token, JWT_SECRET) as Pick<User, '_id'>;

      request.userId = _id;

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) return respondWithUnauthorized(response, 'Access token expired');

      if (error instanceof JsonWebTokenError)
        return respondWithUnauthorized(response, error.message || 'Invalid access token');

      return respondWithUnauthorized(response, 'Unauthorized to access this route');
    }
  };

export default authMiddleware;
