import { envVar } from '@env';
import axios from 'axios';

export const backendAPI = axios.create({
  baseURL: envVar.VITE_BACKEND_URL,
  withCredentials: true,
});
