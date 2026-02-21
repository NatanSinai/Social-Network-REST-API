import { useAuth } from '@hooks';
import type { FC } from 'react';
import { ProtectedRoute, type ProtectedRouteProps } from '..';

export type UserProtectedRouteProps = ProtectedRouteProps;

const UserProtectedRoute: FC<UserProtectedRouteProps> = ({ isRedirect, ...protectedRouteProps }) => {
  const { userId } = useAuth();

  const totalIsRedirect = isRedirect || !userId;

  return <ProtectedRoute {...{ isRedirect: totalIsRedirect, ...protectedRouteProps }} />;
};

export default UserProtectedRoute;
