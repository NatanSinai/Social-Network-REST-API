export enum ModelName {
  USER = 'user',
  POST = 'post',
  COMMENT = 'comment',
  USER_SESSION = 'userSession',
}

export const OBJECT_ID_LENGTH = 24;

export enum CookieName {
  REFRESH_TOKEN = 'refreshToken',
}

export enum NoAuthorizationReason {
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNAUTHORIZED_TO_ACCESS_ROUTE = 'UNAUTHORIZED_TO_ACCESS_ROUTE',
  NO_TOKEN = 'NO_TOKEN',
}
