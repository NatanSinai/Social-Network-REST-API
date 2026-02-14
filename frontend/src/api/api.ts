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

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await backendAPI.post('/auth/refresh');
        const { newAccessToken } = res.data;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return backendAPI(originalRequest); // Retry the original request
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // Force redirect
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
