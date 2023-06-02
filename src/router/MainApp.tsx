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
import AdminRoutes from './admin/AdminRoute';
import AccountRoutes from './account/AccountRoute';

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
              <Route path='/' element={<Navigate to="dashboard" />} />
              <Route
                path="dashboard/*"
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
              <Route path='account/*' element={<AccountRoutes />} />
              <Route path="admin/*" element={<AdminRoutes />} />
              <Route path="register" element={<PageRegister />} />
              <Route path="*" element={<ErrorPage errorCode={404} />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
      {/* </ClientOnly> */}
    </ErrorBoundary>
  );
};
