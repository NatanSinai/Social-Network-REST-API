import type { RefreshTokenJWTPayload } from '@/auth/auth.types';
import { envVar, NoAuthorizationReason, Service } from '@utils';
import { hashSync } from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';
import type { QueryOptions } from 'mongoose';
import ms, { type StringValue } from 'ms';
import userSessionModel from './userSession.model';
import type { CreateUserSessionDTO, UpdateUserSessionDTO, UserSessionDocument } from './userSession.types';

export default class UserSessionService extends Service<
  UserSessionDocument,
  CreateUserSessionDTO,
  UpdateUserSessionDTO
> {
  constructor() {
    super(userSessionModel);
  }

  updateById(
    sessionId: UserSessionDocument['_id'],
    { refreshToken, ...updateUserSessionDTO }: UpdateUserSessionDTO,
    options?: QueryOptions<UserSessionDocument>,
  ) {
    const { JWT_REFRESH_HASH_SALT_ROUNDS, JWT_REFRESH_EXPIRATION } = envVar;

    const tokenHash = refreshToken ? hashSync(refreshToken, JWT_REFRESH_HASH_SALT_ROUNDS) : '';
    const expiresAt = new Date(Date.now() + ms(JWT_REFRESH_EXPIRATION as StringValue));

    return this.model.findByIdAndUpdate(sessionId, { ...updateUserSessionDTO, tokenHash, expiresAt }, options);
  }

  verifyRefreshToken(refreshToken: string) {
    const { JWT_REFRESH_SECRET } = envVar;

    try {
      const payload = verify(refreshToken, JWT_REFRESH_SECRET) as RefreshTokenJWTPayload;

      return { payload };
    } catch (error) {
      if (error instanceof TokenExpiredError)
        return { message: 'Refresh token expired', reason: NoAuthorizationReason.TOKEN_EXPIRED };

      if (error instanceof JsonWebTokenError)
        return { message: 'Invalid refresh token', reason: NoAuthorizationReason.INVALID_TOKEN };

      return { message: 'Refresh token error', reason: NoAuthorizationReason.UNAUTHORIZED_TO_ACCESS_ROUTE };
    }
  }
}
