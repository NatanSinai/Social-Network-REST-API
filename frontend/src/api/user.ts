import { backendAPI } from '@/api/api';
import { User } from '@entities';

export const USERS_BASE_API = '/users';
export const getUser = async (userId: string) => {
  const { data: user } = await backendAPI.get<User>(`${USERS_BASE_API}/${userId}`);

  return user;
};

export type UpdateUserDetailsDTO = {
  username?: string;
  image?: File | null;
};

export const updateUserDetails = async (userId: string, body: UpdateUserDetailsDTO) => {
  const formData = new FormData();

  if (body.username) formData.append('username', body.username);
  if (body.image) formData.append('profilePicture', body.image);
  if (body.image === null) formData.append('isDeleteImage', 'true');

  return backendAPI.put(`${USERS_BASE_API}/${userId}`, formData);
};
