import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import { userState } from '@constants';
import { Box } from '@mui/material';
import { memo, useMemo } from 'react';
import { Navigate, Outlet, type RouteObject, useRoutes } from 'react-router-dom';
import { INITIAL_USER_ROUTE, type ProtectedRouteObject, RoutePath, UserProtectedRoute, protectRoute } from './';

export type RouterProviderProps = {};

export const RouterProvider = memo<RouterProviderProps>(() => {
  const userProtectedRoutes = useMemo(() => {
    const routes: ProtectedRouteObject[] = [
      {
        path: RoutePath._HOME,
        element: (
          <Box height="100%">
            <Outlet />
          </Box>
        ),
        children: [{ path: RoutePath.POSTS_FEED, element: <div>hello</div> }],
      },
    ];

    const userProtectedRoutes = routes.map(protectRoute(UserProtectedRoute)) as RouteObject[];

    return userProtectedRoutes;
  }, []);

  const loginRoute = useMemo<RouteObject>(
    () => ({
      path: RoutePath.LOGIN,
      element: !userState.data ? <Login /> : <Navigate to={INITIAL_USER_ROUTE} />,
    }),
    [],
  );

  const signUpRoute = useMemo<RouteObject>(
    () => ({
      path: RoutePath.SIGNUP,
      element: !userState.data ? <SignUp /> : <Navigate to={INITIAL_USER_ROUTE} />,
    }),
    [],
  );

  const routes = useMemo<RouteObject[]>(
    () => [
      {
        path: RoutePath._ROOT,
        element: (
          <Box bgcolor="primary.main" height="100%">
            <Outlet />
          </Box>
        ),
        children: [loginRoute, signUpRoute, ...userProtectedRoutes],
      },
      { path: '*', element: <Navigate to={INITIAL_USER_ROUTE} /> },
      { path: `${RoutePath._ROOT}/`, element: <Navigate to={INITIAL_USER_ROUTE} /> },
    ],
    [loginRoute, signUpRoute, userProtectedRoutes],
  );

  const router = useRoutes(routes);

  return router;
});
