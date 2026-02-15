import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useCallback } from 'react';
import api from '../utils/api/api';

interface AppToken extends JwtPayload {
  userId: string;
  ipAddress: string;
}

const useUser = () => {
  const getUserId = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode<AppToken>(token);
      return decoded.userId;
    }
    return null;
  }, []);

  const getUserPosts = useCallback(async (userId: string) => {
    const posts = await api.get(`/posts?senderId=${userId}`);
    return (
      posts.data?.sort(
        (first: { createdAt: string | number | Date }, second: { createdAt: string | number | Date }) =>
          new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
      ) || []
    );
  }, []);

  const getUserDetails = useCallback(async (userId: string) => {
    const user = await api.get(`/users/${userId}`);
    return user.data || {};
  }, []);

  return { getUserId, getUserPosts, getUserDetails };
};

export default useUser;
