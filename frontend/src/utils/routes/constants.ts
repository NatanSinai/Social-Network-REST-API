export enum RoutePath {
  _ROOT = '/v1',
  LOGIN = `${_ROOT}/login`,
  _HOME = `${_ROOT}/home`,
  POSTS_FEED = `${_HOME}/feed`,
}

export const INITIAL_USER_ROUTE = RoutePath.POSTS_FEED;
