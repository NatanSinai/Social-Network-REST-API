import type { FC } from 'react';
import type { RouteObject } from 'react-router-dom';
import type { ProtectedRouteProps } from './';

export type ProtectedRouteObject = Omit<RouteObject, 'children'> &
  Pick<ProtectedRouteProps, 'isRedirect' | 'redirectPath'> & { children?: ProtectedRouteObject[] };

export const protectRoute =
  (ProtectedRoute: FC<ProtectedRouteProps>) =>
  ({
    element,
    isRedirect = false,
    redirectPath,
    children,
    ...routeObject
  }: ProtectedRouteObject): ProtectedRouteObject => ({
    ...routeObject,
    children: children?.map(protectRoute(ProtectedRoute)),
    element: <ProtectedRoute {...{ isRedirect, redirectPath }}>{element}</ProtectedRoute>,
  });
