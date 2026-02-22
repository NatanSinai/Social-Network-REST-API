import { envVar } from '@env';
import axios from 'axios';

export const backendAPI = axios.create({
  baseURL: envVar.VITE_BACKEND_URL,
  withCredentials: true,
});

backendAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

backendAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;

      try {
        const res = await backendAPI.post('/auth/refresh');
        const { newAccessToken } = res.data;

        localStorage.setItem('accessToken', newAccessToken);

        return backendAPI(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        window.location.replace('/v1/login');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403 || (error.response?.status === 401 && originalRequest.url === '/auth/refresh')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');

      if (window.location.pathname !== '/v1/login') {
        window.location.replace('/v1/login');
      }
    }

    return Promise.reject(error);
  },
);
