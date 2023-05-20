import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout, Loader } from '../components/layout';
import { Suspense } from 'react';
import { PageLogin } from '../auth/login/PageLogin';
import { PageLogout } from '../auth/login/PageLogout';
import { AuthenticatedRouteGuard } from './guard';
import React from 'react';
import { PageRegister } from '../auth/register/RegisterPage';
import { ErrorPage } from './dashboard/ErrorPage';

const LazyDashboardRoute = React.lazy(
  () => import('@/src/router/dashboard/DashboardRoutes')
);

export const MainApp = () => {
  return (
    <ErrorBoundary>
      {/* <ClientOnly> */}
      <BrowserRouter basename="/app">
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/">
                <Route
                  index
                  element={
                    <AuthenticatedRouteGuard>
                      <LazyDashboardRoute />
                    </AuthenticatedRouteGuard>
                  }
                />
                <Route path="login" element={<PageLogin />} />
                <Route
                  path="logout"
                  element={
                    <ErrorBoundary>
                      <PageLogout />
                    </ErrorBoundary>
                  }
                />
                <Route path="register" element={<PageRegister />} />
                <Route path="*" element={<ErrorPage errorCode={404} />} />
              </Route>
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      {/* </ClientOnly> */}
    </ErrorBoundary>
  );
};
