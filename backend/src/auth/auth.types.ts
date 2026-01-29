import type { User } from '@user/user.types';
import type { UserSession } from '@userSession/userSession.types';

export type AccessTokenJWTPayload = { userId: User['_id'] };

export type RefreshTokenJWTPayload = AccessTokenJWTPayload & { sessionId: UserSession['_id'] };
