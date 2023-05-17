import { DEFAULT_LANGUAGE_KEY } from '@/src/constants/i18next';
import { UseMutationOptions } from '@tanstack/react-query';
import Axios, { AxiosError } from 'axios';
import { Account, AccountError } from '@/src/types/account.types';
import { useMutation } from '@tanstack/react-query';

export const useCreateAccount = (
  config: UseMutationOptions<
    Account,
    AxiosError<AccountError>,
    Pick<Account, 'name' | 'email' | 'langKey'> & { password: string }
  > = {}
) => {
  return useMutation(
    ({
      name,
      email,
      password,
      langKey = DEFAULT_LANGUAGE_KEY,
    }): Promise<Account> =>
      Axios.post('/api/auth/register', { name, email, password, langKey }),
    {
      ...config,
    }
  );
};
