import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuthContext } from './AuthContext';
import { axiosInstace } from '@/src/config/axios';

export const useLogin = (
  config: UseMutationOptions<
    { accessToken: string },
    AxiosError<TODO>,
    { name: string; password: string }
  > = {}
) => {
  const { updateToken } = useAuthContext();
  return useMutation(
    (data) =>
      axiosInstace.post('/api/auth/login', data)?.then((res) => res?.data),
    {
      ...config,
      onSuccess: (data, ...rest) => {
        updateToken(data?.accessToken);
        if (config?.onSuccess) {
          config?.onSuccess(data, ...rest);
        }
      },
    }
  );
};
