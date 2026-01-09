import { envVar, NoAuthorizationReason, respondWithForbidden, respondWithUnauthorized } from '@utils';
import type { NextFunction, Request, Response } from 'express';
import type { ParamsDictionary, Query } from 'express-serve-static-core';
import { JsonWebTokenError, TokenExpiredError, verify, type JwtPayload } from 'jsonwebtoken';

const authMiddleware =
  <P = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = Query>() =>
  (request: Request<P, ResBody, ReqBody, ReqQuery>, response: Response<ResBody>, next: NextFunction) => {
    const { JWT_SECRET } = envVar;

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return respondWithForbidden(response, 'No access token provided');

    try {
      const { userId } = verify(token, JWT_SECRET) as JwtPayload;

      request.userId = userId;
      request.authCookies = { refreshToken: request.cookies?.refreshToken };

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError)
        return respondWithUnauthorized(
          response,
          'Access token expired, please refresh it',
          NoAuthorizationReason.TOKEN_EXPIRED,
        );

      if (error instanceof JsonWebTokenError)
        return respondWithUnauthorized(
          response,
          error.message || 'Invalid access token',
          NoAuthorizationReason.INVALID_TOKEN,
        );

      return respondWithUnauthorized(
        response,
        'Unauthorized to access this routeNoAuthorization',
        NoAuthorizationReason.UNAUTHORIZED_TO_ACCESS_ROUTE,
      );
    }
  };

export default authMiddleware;
