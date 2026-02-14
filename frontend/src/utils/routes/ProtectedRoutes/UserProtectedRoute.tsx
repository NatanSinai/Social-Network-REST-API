import useAuth from '@/hooks/useAuth';
import type { FC } from 'react';
import { ProtectedRoute, type ProtectedRouteProps } from '..';

export type UserProtectedRouteProps = ProtectedRouteProps;

const UserProtectedRoute: FC<UserProtectedRouteProps> = ({ isRedirect, ...protectedRouteProps }) => {
  const { isUserLoggedIn: isLoggedIn } = useAuth();

  const totalIsRedirect = isRedirect || !isLoggedIn;

  return <ProtectedRoute {...{ isRedirect: totalIsRedirect, ...protectedRouteProps }} />;
};

export default UserProtectedRoute;
