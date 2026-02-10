import useAuth from '@/hooks/useAuth';
import { memo, useMemo } from 'react';
import { ProtectedRoute, type ProtectedRouteProps } from '..';

export type UserProtectedRouteProps = ProtectedRouteProps;

const UserProtectedRoute = memo<UserProtectedRouteProps>(({ isRedirect, ...protectedRouteProps }) => {
  const { isUserLoggedIn: isLoggedIn } = useAuth();
  const totalIsRedirect = useMemo(() => isRedirect || !isLoggedIn, [isRedirect, isLoggedIn]);

  return <ProtectedRoute {...{ isRedirect: totalIsRedirect, ...protectedRouteProps }} />;
});

export default UserProtectedRoute;
