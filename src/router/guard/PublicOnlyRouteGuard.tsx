import { FC } from 'react';

import { Navigate } from 'react-router-dom';

import { ErrorBoundary } from '@/src/components/shared';
import { useAuthContext } from '@/src/services/auth/AuthContext';

export const PublicOnlyRouteGuard: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthContext();

  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : (
    <ErrorBoundary>{children}</ErrorBoundary>
  );
};
