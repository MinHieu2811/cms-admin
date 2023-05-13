import { ErrorBoundary } from '@/src/components/shared/ErrorBoundary';
import { useAuthContext } from '@/src/services/auth/AuthContext';
import React from 'react';
import { useDirectUnauthenticated } from './useDirectAuthenticated';
interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export const AuthenticatedRouteGuard: React.FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthContext();
  useDirectUnauthenticated()

  return !isAuthenticated ? null : (
    <ErrorBoundary>{children}</ErrorBoundary>
  )
};
