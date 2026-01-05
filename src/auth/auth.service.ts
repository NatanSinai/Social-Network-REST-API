import { envVar } from '@utils';
import { sign } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import type { TokensPayload } from './auth.types';

export default class AuthService {
  generateAccessToken = (payload: string | Buffer | object) => {
    const { JWT_SECRET, JWT_EXPIRATION } = envVar;

    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION as StringValue });
  };

  generateRefreshToken = (payload: string | Buffer | object) => {
    const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } = envVar;

    return sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION as StringValue });
  };

  generateTokens = (payload: string | Buffer | object) => {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const tokens = { accessToken, refreshToken } satisfies TokensPayload;

    return tokens;
  };
}
