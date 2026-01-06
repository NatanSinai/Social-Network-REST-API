import UserRefreshTokenService from '@/userRefreshToken/userRefreshToken.service';
import type { User } from '@user/user.types';
import { envVar } from '@utils';
import { sign } from 'jsonwebtoken';
import type { ObjectId } from 'mongoose';
import type { StringValue } from 'ms';
import { pick } from 'rambda';
import type { TokensPayload } from './auth.types';

export default class AuthService {
  private userRefreshTokenService = new UserRefreshTokenService();

  private generateAccessToken = (payload: string | Buffer | object) => {
    const { JWT_SECRET, JWT_EXPIRATION } = envVar;

    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION as StringValue });
  };

  private generateRefreshToken = (payload: string | Buffer | object) => {
    const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } = envVar;

    return sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION as StringValue });
  };

  private generateTokens = (payload: string | Buffer | object) => {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const tokens = { accessToken, refreshToken } satisfies TokensPayload;

    return tokens;
  };

  generateUserTokens = async (user: User) => {
    const userId = user._id as unknown as ObjectId;
    const userPayload = pick('_id')(user);
    const { accessToken, refreshToken } = this.generateTokens(userPayload);

    const userToken = await this.userRefreshTokenService.getOne({ userId });

    if (userToken) await this.userRefreshTokenService.deleteById(userToken._id);

    await this.userRefreshTokenService.createSingle({ userId, refreshToken });

    return { accessToken, refreshToken };
  };
}
