import { DEFAULT_LANGUAGE_KEY } from '@/src/constants/i18next';
import {
  UseMutationOptions,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Account, AccountError } from '@/src/types/account.types';
import { useMutation } from '@tanstack/react-query';
import {
  createQueryKeys,
  inferQueryKeys,
} from '@lukemorales/query-key-factory';
import { useTranslation } from 'react-i18next';
import { ROLE_ADMIN } from '@/src/constants';
import { useState } from 'react';
import { axiosInstace } from '@/src/config/axios';

export const accountKeys = createQueryKeys('accountService', {
  account: null,
});

type AccountKeys = inferQueryKeys<typeof accountKeys>;

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
      axiosInstace.post('/api/auth/register', {
        name,
        email,
        password,
        langKey,
      }),
    {
      ...config,
    }
  );
};

export const useAccount = (
  config: UseQueryOptions<
    Account,
    AxiosError,
    Account,
    AccountKeys['account']['queryKey']
  > = {}
) => {
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { data: account, ...rest } = useQuery(
    accountKeys.account.queryKey,
    async (): Promise<Account> => {
      setLoading(true);
      const res = await axiosInstace
        .get('/api/auth/account')
        ?.then((res) => res?.data)
        ?.catch((err) => console.error(err))
        .finally(() => {
          setLoading(false);
        });

      return res;
    },
    {
      onSuccess: (data) => {
        i18n.changeLanguage(data?.langKey);

        if (config?.onSuccess) {
          config?.onSuccess(data);
        }
      },
      ...config,
    }
  );

  const isAdmin = !!account?.authorities?.includes(ROLE_ADMIN);
  return { isAdmin, account, ...rest, loading };
};

export const useUpdateAccount = (
  config: UseMutationOptions<Account, AxiosError<TODO>, Partial<Account>> = {}
) => {
  const { i18n } = useTranslation();
  return useMutation(
    (account): Promise<Account> =>
      axiosInstace.put('/api/profile/update', account).then((res) => res?.data),
    {
      onMutate: (data) => {
        i18n.changeLanguage(data?.langKey);

        if (config?.onMutate) {
          config.onMutate(data);
        }
      },
      ...config,
    }
  );
};

export const useUpdatePassword = (
  config: UseMutationOptions<
    void,
    AxiosError<TODO>,
    { currentPassword: string; newPassword: string }
  > = {}
) => {
  return useMutation(
    (payload): Promise<void> => axiosInstace.put('/api/profile/update-password', payload),
    {
      ...config,
    }
  );
};
