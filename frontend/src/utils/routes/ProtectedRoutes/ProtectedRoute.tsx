import type { Prettify } from '@types';
import { memo, type PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { RoutePath } from '../constants';

export type ProtectedRouteProps = Prettify<
  PropsWithChildren<Partial<{ isRedirect: boolean; redirectPath: RoutePath }>>
>;

const ProtectedRoute = memo<ProtectedRouteProps>(({ redirectPath = RoutePath.LOGIN, isRedirect, children }) => {
  if (isRedirect) return <Navigate to={redirectPath} replace />;

  return children ?? <Outlet />;
});

export default ProtectedRoute;
