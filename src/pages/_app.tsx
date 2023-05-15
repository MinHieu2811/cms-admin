// import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import { MainProvider } from '../services/MainProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { Viewport } from '../components/shared/Viewport';
import { SessionProvider } from 'next-auth/react';

export default function src({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <MainProvider>
        <ErrorBoundary>
          <Viewport>
            <Component {...pageProps} />
          </Viewport>
        </ErrorBoundary>
      </MainProvider>
    </SessionProvider>
  );
}
