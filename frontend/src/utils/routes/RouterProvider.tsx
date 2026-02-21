import ProfilePage from '@/pages/Profile';
import { useAuthContext } from '@/providers/AuthProvider';
import { Navbar } from '@components';
import { Box } from '@mui/material';
import { Login, PostsFeedPage, SignUp } from '@pages';
import { memo, useMemo } from 'react';
import { Navigate, Outlet, type RouteObject, useRoutes } from 'react-router-dom';
import { INITIAL_USER_ROUTE, type ProtectedRouteObject, RoutePath, UserProtectedRoute, protectRoute } from './';

export type RouterProviderProps = {};

export const RouterProvider = memo<RouterProviderProps>(() => {
  const { userId } = useAuthContext();

  const userProtectedRoutes = useMemo(() => {
    const routes: ProtectedRouteObject[] = [
      {
        path: RoutePath._HOME,
        element: (
          <Box height='100%'>
            <Outlet />
          </Box>
        ),
        children: [{ path: RoutePath.POSTS_FEED, element: <PostsFeedPage /> }],
      },
      {
        path: RoutePath._HOME,
        element: (
          <Box height='100%'>
            <Outlet />
          </Box>
        ),
        children: [{ path: RoutePath.PROFILE, element: <ProfilePage /> }],
      },
    ];

    const userProtectedRoutes = routes.map(protectRoute(UserProtectedRoute)) as RouteObject[];

    return userProtectedRoutes;
  }, []);

  const loginRoute = useMemo<RouteObject>(
    () => ({
      path: RoutePath.LOGIN,
      element: !userId ? <Login /> : <Navigate to={INITIAL_USER_ROUTE} />,
    }),
    [userId],
  );

  const signUpRoute = useMemo<RouteObject>(
    () => ({
      path: RoutePath.SIGNUP,
      element: !userId ? <SignUp /> : <Navigate to={INITIAL_USER_ROUTE} />,
    }),
    [userId],
  );

  const routes = useMemo<RouteObject[]>(
    () => [
      {
        path: RoutePath._ROOT,
        element: (
          <Box bgcolor='primary.main' height='100vh' display='flex' flexDirection='column'>
            <Navbar />

            <Box flexGrow={1} overflow='auto'>
              <Outlet />
            </Box>
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
