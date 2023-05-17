// import '@/styles/globals.css'
import type { AppProps } from 'next/app';
import { MainProvider } from '../services/MainProvider';
import { ErrorBoundary } from '../components/shared/ErrorBoundary';
import { Viewport } from '../components/shared/Viewport';

export default function src({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <MainProvider>
      <ErrorBoundary>
        <Viewport>
          <Component {...pageProps} />
        </Viewport>
      </ErrorBoundary>
    </MainProvider>
  );
}
