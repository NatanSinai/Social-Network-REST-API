import { memo, useMemo } from 'react';
import { ProtectedRoute, type ProtectedRouteProps } from '..';
import { useAuth } from '../../auth/AuthProvider';

export type UserProtectedRouteProps = ProtectedRouteProps;

const UserProtectedRoute = memo<UserProtectedRouteProps>(({ isRedirect, ...protectedRouteProps }) => {
  const { user } = useAuth();
  const totalIsRedirect = useMemo(() => isRedirect || !user, [isRedirect, user]);

  return <ProtectedRoute {...{ isRedirect: totalIsRedirect, ...protectedRouteProps }} />;
});

export default UserProtectedRoute;
