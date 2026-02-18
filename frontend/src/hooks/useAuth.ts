import { useAuthContext } from '@/providers/AuthProvider';

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
