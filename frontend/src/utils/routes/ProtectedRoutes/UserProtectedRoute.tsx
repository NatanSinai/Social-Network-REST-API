import { userState } from '@constants';
import { memo, useMemo } from 'react';
import { ProtectedRoute, type ProtectedRouteProps } from '..';

export type UserProtectedRouteProps = ProtectedRouteProps;

const UserProtectedRoute = memo<UserProtectedRouteProps>(({ isRedirect, ...protectedRouteProps }) => {
  const totalIsRedirect = useMemo(() => isRedirect || !userState.data, [isRedirect]);

  return <ProtectedRoute {...{ isRedirect: totalIsRedirect, ...protectedRouteProps }} />;
});

export default UserProtectedRoute;
