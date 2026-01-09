import type { User } from '@user/user.types';
import UserSessionService from '@userSession/userSession.service';
import type { UserSession } from '@userSession/userSession.types';
import { CookieName, envVar } from '@utils';
import type { Response } from 'express';
import { sign } from 'jsonwebtoken';
import type { StringValue } from 'ms';

type UserPayload = Pick<UserSession, 'ip'> & { userId: User['_id']; sessionId?: UserSession['_id'] };

export default class AuthService {
  private userSessionService = new UserSessionService();

  private generateAccessToken = ({ userId }: UserPayload) => {
    const { JWT_SECRET, JWT_EXPIRATION } = envVar;

    return sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION as StringValue });
  };

  generateRefreshToken = ({ userId, sessionId }: UserPayload) => {
    const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } = envVar;

    return sign({ userId, sessionId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION as StringValue });
  };

  private generateTokens = (payload: UserPayload) => {
    const refreshToken = this.generateRefreshToken(payload);
    const accessToken = this.generateAccessToken(payload);

    const tokens = { accessToken, refreshToken };

    return tokens;
  };

  generateUserTokens = async ({ userId, ip }: UserPayload) => {
    const session = await this.userSessionService.createSingle({ userId, ip });

    const { accessToken, refreshToken } = this.generateTokens({ userId, ip, sessionId: session._id });

    await this.userSessionService.updateById(session._id, { refreshToken });

    return { accessToken, refreshToken };
  };

  removeRefreshToken = async ({ response, refreshToken }: { refreshToken: string; response: Response }) => {
    const payload = this.userSessionService.verifyRefreshToken(refreshToken, response);

    if (!payload) return;

    await this.userSessionService.deleteById(payload.sessionId);

    response.clearCookie(CookieName.REFRESH_TOKEN);
  };

  // refreshAccessToken = async ({ tokenHash: refreshToken }: Pick<UserSession, 'refreshToken'>) => {
  //   const { JWT_REFRESH_SECRET } = envVar;

  //   const { sub: userId } = verify(refreshToken, JWT_REFRESH_SECRET) as JwtPayload;

  //   const newRefreshToken = this.generateRefreshToken({ _id: userId });
  // };
}
