import { axiosInstace } from "@/src/config/axios";
import { UserList } from "@/src/types/account.types";
import { createQueryKeys, inferQueryKeys } from "@lukemorales/query-key-factory";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

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