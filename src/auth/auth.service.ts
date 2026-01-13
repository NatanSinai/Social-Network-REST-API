import UserSessionService from '@userSession/userSession.service';
import type { UpdateUserSessionDTO, UserSession } from '@userSession/userSession.types';
import { CookieName, envVar, NoAuthorizationReason, respondWithUnauthorized } from '@utils';
import type { Response } from 'express';
import { sign } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import type { AccessTokenJWTPayload, RefreshTokenJWTPayload } from './auth.types';

export default class AuthService {
  private userSessionService = new UserSessionService();

  generateAccessToken = ({ userId }: AccessTokenJWTPayload) => {
    const { JWT_SECRET, JWT_EXPIRATION } = envVar;

    return sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION as StringValue });
  };

  generateRefreshToken = ({ userId, sessionId }: RefreshTokenJWTPayload) => {
    const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } = envVar;

    return sign({ userId, sessionId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION as StringValue });
  };

  private generateTokens = (payload: RefreshTokenJWTPayload) => {
    const refreshToken = this.generateRefreshToken(payload);
    const accessToken = this.generateAccessToken(payload);

    const tokens = { accessToken, refreshToken };

    return tokens;
  };

  generateUserTokens = async ({ userId, ip }: Pick<AccessTokenJWTPayload, 'userId'> & Pick<UserSession, 'ip'>) => {
    const sessionWithoutToken = await this.userSessionService.createSingle({ userId, ip });

    const { accessToken, refreshToken } = this.generateTokens({ userId, sessionId: sessionWithoutToken._id });

    await this.userSessionService.updateById(sessionWithoutToken._id, { refreshToken });

    return { accessToken, refreshToken };
  };

  removeRefreshToken = async ({ response, refreshToken }: UpdateUserSessionDTO & { response: Response }) => {
    const payloadOrErrorConfig = this.userSessionService.verifyRefreshToken(refreshToken);

    if (!payloadOrErrorConfig.payload)
      return respondWithUnauthorized(response, payloadOrErrorConfig?.message, payloadOrErrorConfig?.reason);

    await this.userSessionService.deleteById(payloadOrErrorConfig.payload.sessionId);

    response.clearCookie(CookieName.REFRESH_TOKEN);
  };

  refreshAccessToken = async ({ refreshToken }: UpdateUserSessionDTO) => {
    const payloadOrErrorConfig = this.userSessionService.verifyRefreshToken(refreshToken);

    if (!payloadOrErrorConfig.payload) return { ...payloadOrErrorConfig, tokens: null };

    const {
      payload: { sessionId, userId },
    } = payloadOrErrorConfig;

    const session = await this.userSessionService.getById(sessionId);

    if (!session) return { message: 'No session found', reason: NoAuthorizationReason.NO_SESSION, tokens: null };

    if (session?.expiresAt && session.expiresAt < new Date())
      return { message: 'Refresh token expired', reason: NoAuthorizationReason.TOKEN_EXPIRED, tokens: null };

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this.generateTokens({ userId, sessionId });

    await this.userSessionService.updateById(session._id, { refreshToken: newRefreshToken });

    return { tokens: { newAccessToken, newRefreshToken } };
  };
}
