import { axiosInstace } from '@/src/config/axios';
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
  user: (params: { login?: string }) => [params],
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
      axiosInstace.get(USERS_BASE_URL).then((res) => res?.data),
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
  config: UseMutationOptions<User, AxiosError<UserMutateError>, User> = {}
) => {
  const queryClient = useQueryClient();
  return useMutation((payload) => axiosInstace.put(USERS_BASE_URL, payload), {
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
                  user?.id === data?.id ? data : user
                ),
              };
            }
          );
        });
      queryClient?.invalidateQueries(usersKeys?.users?._def);
      queryClient?.invalidateQueries(usersKeys.user({ login: payload?.login }));
      if (config?.onSuccess) {
        config?.onSuccess(data, payload, ...rest);
      }
    },
  });
};
