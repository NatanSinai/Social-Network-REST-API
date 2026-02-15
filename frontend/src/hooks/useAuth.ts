import { useCallback, useState } from 'react';
import api from '../utils/api/api';

type UseAuthReturnType = {
  signup: (username: string, email: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isUserLoggedIn: boolean;
};

const useAuth: () => UseAuthReturnType = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(!!localStorage.getItem('accessToken'));

  const signup = useCallback(async (username: string, email: string, password: string) => {
    await api.post('/users', { username, email, password });
    await login(username, password);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.post('/auth/login', { username, password });
    const { accessToken } = res.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsUserLoggedIn(true);
    }
  }, []);

  const loginWithGoogle = useCallback(async (idToken: string) => {
    const res = await api.post('/auth/google', { idToken });
    const { accessToken } = res.data;

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsUserLoggedIn(true);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setIsUserLoggedIn(false);
    }
  }, []);

  return { signup, login, logout, isUserLoggedIn, loginWithGoogle };
};

export default useAuth;
