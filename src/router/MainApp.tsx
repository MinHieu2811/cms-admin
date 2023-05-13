import { Flex, Progress } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Viewport } from '../components/shared/Viewport';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ClientOnly from '../components/shared/ClientOnly';
import { isBrowser } from '../utils/checkBrowser';
import { Layout, Loader } from '../components/layout';
import { Suspense } from 'react';
import { PageLogin } from '../auth/login/PageLogin';
import { PageLogout } from '../auth/login/PageLogout';
import { AuthenticatedRouteGuard } from './guard';

export const MainApp = () => {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <BrowserRouter basename="/app">
          <Layout>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="login" element={<PageLogin />} />
                <Route path="logout" element={<PageLogout />} />
                <Route
                path="dashboard/*"
                element={
                  <AuthenticatedRouteGuard>
                    {/* <DashboardRoutes /> */}
                  </AuthenticatedRouteGuard>
                }
              />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </ClientOnly>
    </ErrorBoundary>
  );
};
