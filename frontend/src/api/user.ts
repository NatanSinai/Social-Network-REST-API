import { backendAPI } from '@/api/api';
import { User } from '@entities';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export const USERS_BASE_API = '/users';
interface AppToken extends JwtPayload {
  userId: string;
  ipAddress: string;
}
export const getUser = async (userId: string) => {
  const { data: user } = await backendAPI.get<User>(`${USERS_BASE_API}/${userId}`);

  return user;
};

export const getUserId = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const decoded = jwtDecode<AppToken>(token);
    return decoded.userId;
  }
};

export type UpdateUserDetailsDTO = { username?: string; profilePictureURL?: string | null };

export const updateUserDetails = async (userId: string, body: UpdateUserDetailsDTO) => {
  return backendAPI.put(`${USERS_BASE_API}/${userId}`, body, {
    headers: { 'Content-Type': 'application/json' },
  });
};
