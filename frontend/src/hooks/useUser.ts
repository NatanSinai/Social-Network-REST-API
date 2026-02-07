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
  }, []);

  const getUserPosts = useCallback(async (userId: string) => {
    const posts = await api.get(`/posts`, { params: { sender: userId } });
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

  const updateUserDetails = useCallback(async (userId: string, body: { username?: string; avatar?: File | null }) => {
    try {
      await api.put(`/users/${userId}`, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      return true;
    } catch (error) {
      console.error('Failed to update user details:', error);
      return false;
    }
  }, []);

  return { getUserId, getUserPosts, getUserDetails, updateUserDetails };
};

export default useUser;
