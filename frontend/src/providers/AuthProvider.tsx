import { backendAPI } from '@api';
import { useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';

type AuthContextType = {
  isUserLoggedIn: boolean;
  userId: string | undefined;
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(!!localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ userId: string }>(token);
        setUserId(decoded.userId);
      } catch (e) {
        console.error('Failed to decode token', e);
        setUserId(undefined);
      }
    } else {
      setUserId(undefined);
    }
  }, [isUserLoggedIn]);

  const signup = async (username: string, email: string, password: string) => {
    await backendAPI.post('/users', { username, email, password });
    await login(username, password);
  };

  const login = async (username: string, password: string) => {
    const res = await backendAPI.post('/auth/login', { username, password });
    const { accessToken } = res.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsUserLoggedIn(true);
      await queryClient.invalidateQueries();
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    const res = await backendAPI.post('/auth/google', { idToken });
    const { accessToken } = res.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsUserLoggedIn(true);
      await queryClient.invalidateQueries();
    }
  };

  const logout = async () => {
    try {
      await backendAPI.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setIsUserLoggedIn(false);
      queryClient.clear();
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      setIsUserLoggedIn(!!localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isUserLoggedIn, userId, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
