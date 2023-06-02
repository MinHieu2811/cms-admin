import { axiosInstace } from '@/src/config/axios';
import { DEFAULT_LANGUAGE_KEY } from '@/src/constants';
import { User, UserList } from '@/src/types/account.types';
import {
  createQueryKeys,
  inferQueryKeys,
} from '@lukemorales/query-key-factory';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';

type UserMutateError = {
  title: string;
  errorKey: 'userexists' | 'emailexists';
};

const USERS_BASE_URL = '/api/admin/user';

const usersKeys = createQueryKeys('usersService', {
  users: (params: { page?: number; size?: number }) => [params],
  user: (params: { id?: string }) => [params],
});
type UsersKeys = inferQueryKeys<typeof usersKeys>;

export const useUserList = (
  { page = 0, size = 10 } = {},
  config: UseQueryOptions<
    UserList,
    AxiosError,
    UserList,
    UsersKeys['users']['queryKey']
  > = {}
) => {
  const result = useQuery(
    usersKeys.users({ page, size }).queryKey,
    (): Promise<UserList> =>
      axiosInstace
        .get(USERS_BASE_URL, { params: { size, page, sort: 'id,desc' } })
        .then((res) => res?.data),
    { keepPreviousData: true, ...config }
  );

  const { content: users, totalItems } = result?.data || {};
  const totalPages = Math.ceil((totalItems ?? 0) / size);
  const hasMore = page + 1 < totalPages;
  const isLoadingPage = result?.isFetching;

  return {
    users,
    totalItems,
    hasMore,
    totalPages,
    isLoadingPage,
    ...result,
  };
};

export const useUserUpdate = (
  config: UseMutationOptions<
    User,
    AxiosError<UserMutateError>,
    Partial<User>
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload) =>
      axiosInstace
        .put(`${USERS_BASE_URL}/update`, payload)
        .then((res) => res?.data),
    {
      ...config,
      onSuccess: (data, payload, ...rest) => {
        queryClient.cancelQueries(usersKeys?.users?._def);
        queryClient
          ?.getQueryCache()
          ?.findAll(usersKeys?.users?._def)
          ?.forEach(({ queryKey }) => {
            queryClient.setQueryData<UserList | undefined>(
              queryKey,
              (cachedData) => {
                if (!cachedData) return;
                return {
                  ...cachedData,
                  content: (cachedData?.content || [])?.map((user) =>
                    user?.id === data?.id ? { ...user, data } : user
                  ),
                };
              }
            );
          });
        queryClient?.invalidateQueries(usersKeys?.users?._def);
        queryClient?.invalidateQueries(
          usersKeys.user({ id: payload?.id })
        );
        if (config?.onSuccess) {
          config?.onSuccess(data, payload, ...rest);
        }
      },
    }
  );
};

type UserWithLoginOnly = Pick<User, 'id'>;

export const useUserRemove = (
  config: UseMutationOptions<void, unknown, UserWithLoginOnly> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    (user: UserWithLoginOnly): Promise<void> =>
      axiosInstace
        .delete(`${USERS_BASE_URL}/delete/${user?.id}`)
        .then((res) => res?.data),
    {
      ...config,
      onSuccess: (...args) => {
        queryClient?.invalidateQueries(usersKeys?.users?._def);
        config?.onSuccess?.(...args);
      },
    }
  );
};

export const useUserCreate = (
  config: UseMutationOptions<
    User,
    AxiosError<UserMutateError>,
    Pick<User, 'hashedPassword' | 'email' | 'name' | 'langKey' | 'authorities'>
  > = {}
) => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ langKey = DEFAULT_LANGUAGE_KEY, ...payload }) =>
      axiosInstace?.post(`${USERS_BASE_URL}/create`, {
        langKey,
        ...payload,
      }),
    {
      ...config,
      onSuccess: (...args) => {
        queryClient?.invalidateQueries(usersKeys?.users?._def);
        config?.onSuccess?.(...args);
      },
    }
  );
};

export const useUser = (userId?: string, config: UseQueryOptions<User, AxiosError, User, UsersKeys['user']['queryKey']> = {}) => {
  const result = useQuery(
    usersKeys?.user({ id: userId }).queryKey,
    (): Promise<User> => axiosInstace.get(`${USERS_BASE_URL}/${userId}`).then((res) => res?.data),
    {
      enabled: !!userId,
      ...config
    }
  )

  return {
    user: result?.data,
    ...result
  }
}