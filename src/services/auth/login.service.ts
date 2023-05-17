import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';
import { useAuthContext } from './AuthContext';

export const useLogin = (
  config: UseMutationOptions<
    { accesssToken: string },
    AxiosError<TODO>,
    { name: string; password: string }
  > = {}
) => {
  const { updateToken } = useAuthContext();
  return useMutation(
    (data) => Axios.post('/api/auth/login', data),
    {
      ...config,
      onSuccess: (data, ...rest) => {
        updateToken(data?.accesssToken);
        if (config?.onSuccess) {
          config?.onSuccess(data, ...rest);
        }
      },
    }
  );
};
