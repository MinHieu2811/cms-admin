import { Flex, Progress } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Viewport } from '../components/shared/Viewport';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { BrowserRouter, Navigate, Route } from 'react-router-dom';
import ClientOnly from '../components/shared/ClientOnly';
import { isBrowser } from '../utils/checkBrowser';
import { Layout } from '../components/layout';
import { Suspense } from 'react';
import { PageLogin } from '../auth/login/page';

export const Mainsrc = () => {
  return (
    <ErrorBoundary>
      <ClientOnly>
        <BrowserRouter basename='/app'>
          <Layout>
            <Suspense>
              <Route path='/' element={<Navigate to="/dashboard" replace />} />
              <Route path='login' element={<PageLogin />} />
            </Suspense>
          </Layout>
        </BrowserRouter>
      </ClientOnly>
    </ErrorBoundary>
  );
};
