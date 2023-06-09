;
import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './auth/AuthContext';
import theme from '@/src/theme'

import '@/src/config';
import { AVAILABLE_LANGUAGES } from '@/src/constants/i18next';

const queryClient = new QueryClient();

interface MainProvider {
  children: React.ReactNode;
}

export const MainProvider: React.FC<MainProvider> = ({ children }) => {
  const { i18n } = useTranslation();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChakraProvider
          theme={{
            ...theme,
            direction:
              AVAILABLE_LANGUAGES?.find(({ key }) => key === i18n.language)
                ?.dir ?? 'ltr',
          }}
        >
          {children}
        </ChakraProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
