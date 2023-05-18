import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';
import { useAuthContext } from './AuthContext';
import { Account } from '@/src/types/account.types';

export const useLogin = (
  config: UseMutationOptions<
    { data: { accessToken: string, userDetail: Account } },
    AxiosError<TODO>,
    { name: string; password: string }
  > = {}
) => {
  const { updateToken, updateProfile } = useAuthContext();
  return useMutation((data) => Axios.post('/api/auth/login', data)?.then((res) => res?.data), {
    ...config,
    onSuccess: (data, ...rest) => {
      updateToken(data?.data?.accessToken);
      updateProfile(data?.data?.userDetail)
      if (config?.onSuccess) {
        config?.onSuccess(data, ...rest);
      }
    },
  });
};
