import { envVar } from '@env';
import type { AccessTokenPayload } from '@types';
import { jwtDecode } from 'jwt-decode';

export const isImageFile = (file: File) => file.type.startsWith('image/');

export const getUserIdFromAccessToken = (token: string) => {
  const { userId = null } = jwtDecode<AccessTokenPayload>(token);

  return userId;
};

export const createFullImageURL = (imageURL: string | null) =>
  imageURL ? `${envVar.VITE_BACKEND_URL}${imageURL}` : null;
