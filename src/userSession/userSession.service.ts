import { envVar, NoAuthorizationReason, respondWithUnauthorized, Service } from '@utils';
import { hashSync } from 'bcrypt';
import type { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError, verify, type JwtPayload } from 'jsonwebtoken';
import type { QueryOptions } from 'mongoose';
import ms, { type StringValue } from 'ms';
import userSessionModel from './userSession.model';
import type { CreateUserSessionDTO, UpdateUserSessionDTO, UserSession, UserSessionDocument } from './userSession.types';

export default class UserSessionService extends Service<
  UserSessionDocument,
  CreateUserSessionDTO,
  UpdateUserSessionDTO
> {
  constructor() {
    super(userSessionModel);
  }

  createSingle(createUserSessionDTO: CreateUserSessionDTO) {
    const { JWT_REFRESH_EXPIRATION } = envVar;

    const expiresAt = new Date(Date.now() + ms(JWT_REFRESH_EXPIRATION as StringValue));

    return this.model.create({ ...createUserSessionDTO, expiresAt });
  }

  updateById(
    sessionId: UserSessionDocument['_id'],
    { refreshToken, ...updateUserSessionDTO }: UpdateUserSessionDTO,
    options?: QueryOptions<UserSessionDocument>,
  ) {
    const { JWT_REFRESH_HASH_SALT_ROUNDS } = envVar;

    const tokenHash = refreshToken ? hashSync(refreshToken, JWT_REFRESH_HASH_SALT_ROUNDS) : '';

    return this.model.findByIdAndUpdate(sessionId, { ...updateUserSessionDTO, tokenHash }, options);
  }

  verifyRefreshToken(refreshToken: string, response: Response) {
    const { JWT_REFRESH_SECRET } = envVar;

    try {
      const payload = verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload & { sessionId: UserSession['_id'] };

      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        respondWithUnauthorized(response, 'Refresh token expired', NoAuthorizationReason.TOKEN_EXPIRED);
      else if (error instanceof JsonWebTokenError)
        respondWithUnauthorized(response, 'Invalid refresh token', NoAuthorizationReason.INVALID_TOKEN);
    }
  }
}
