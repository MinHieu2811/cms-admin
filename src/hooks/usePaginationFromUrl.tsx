import { useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

export const usePaginationFromUrl = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = +(searchParams?.get('page') ?? 1);
  const setPage = useCallback(
    (p: number) => {
      const newPage = Math.max(1, p);
      setSearchParams({ page: newPage?.toString() });
    },
    [setSearchParams]
  );

  return { page, setPage };
};
