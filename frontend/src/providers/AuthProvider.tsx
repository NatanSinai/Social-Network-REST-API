import { backendAPI } from '@api';
import type { User } from '@entities';
import { getUserIdFromAccessToken } from '@helpers';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useState, type FC, type ReactNode } from 'react';
import { useEventListener } from 'usehooks-ts';

type AuthContextType = {
  userId: User['id'] | null;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const queryClient = useQueryClient();

  const updateUserIdFromAccessToken = async (accessToken: string) => {
    const userId = getUserIdFromAccessToken(accessToken);

    localStorage.setItem('accessToken', accessToken);

    if (userId) localStorage.setItem('userId', userId);

    setUserId(userId);

    await queryClient.invalidateQueries();
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

      queryClient.clear();
    }
  };

  const checkAuth = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) updateUserIdFromAccessToken(accessToken);
    else logout();
  };

  useEventListener('storage', checkAuth);

  return (
    <AuthContext.Provider value={{ userId, signup, login, loginWithGoogle, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');

  return context;
};
