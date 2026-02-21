import { backendAPI } from '@api';
import { getUserIdFromAccessToken } from '@helpers';
import { useState } from 'react';

export type UseAuthArgs = {};

export type UseAuthContent = ReturnType<typeof useAuth>;

export const useAuth = () => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const updateUserIdFromAccessToken = (accessToken: string) => {
    const userId = getUserIdFromAccessToken(accessToken);

    localStorage.setItem('accessToken', accessToken);

    if (userId) localStorage.setItem('userId', userId);

    setUserId(userId);
  };

  const signup = async (username: string, email: string, password: string) => {
    await backendAPI.post('/users', { username, email, password });

    await login(username, password);
  };

  const login = async (username: string, password: string) => {
    const {
      data: { accessToken },
    } = await backendAPI.post<{ accessToken: string }>('/auth/login', { username, password });

    updateUserIdFromAccessToken(accessToken);
  };

  const loginWithGoogle = async (idToken: string) => {
    const {
      data: { accessToken },
    } = await backendAPI.post<{ accessToken: string }>('/auth/google', { idToken });

    updateUserIdFromAccessToken(accessToken);
  };

  const logout = async () => {
    try {
      await backendAPI.post('/auth/logout');
    } catch (error) {
      console.error('Error while logout', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUserId(null);
    }
  };

  return { signup, login, logout, userId, loginWithGoogle };
};
