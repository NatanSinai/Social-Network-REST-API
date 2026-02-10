import { useState } from 'react';
import api from '../utils/api/api';

const useAuth = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(!!localStorage.getItem('accessToken'));

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await api.post('/auth/refresh');
          const { newAccessToken } = res.data;

          localStorage.setItem('accessToken', newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          setIsUserLoggedIn(false);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  const signup = async (username: string, email: string, password: string) => {
    await api.post('/users', { username, email, password });
    await login(username, password);
  };

  const login = async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const { accessToken } = res.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsUserLoggedIn(true);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setIsUserLoggedIn(false);
    }
  };

  return { signup, login, logout, isUserLoggedIn };
};

export default useAuth;
