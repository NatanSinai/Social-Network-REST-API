import { memo, useMemo } from 'react';
import { ProtectedRoute, type ProtectedRouteProps } from '..';

export type UserProtectedRouteProps = ProtectedRouteProps;

const UserProtectedRoute = memo<UserProtectedRouteProps>(({ isRedirect, ...protectedRouteProps }) => {
  const totalIsRedirect = useMemo(() => isRedirect /*|| !user*/, [isRedirect]);

  return <ProtectedRoute {...{ isRedirect: totalIsRedirect, ...protectedRouteProps }} />;
});

export default UserProtectedRoute;
