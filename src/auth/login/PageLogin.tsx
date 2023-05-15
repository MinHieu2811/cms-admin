import React from 'react';

import { Box, Button, Center, Heading } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';

import { SlideIn } from '@/src/components/SlideIn';
import { Logo } from '@/src/components/Logo';
import { useTranslation } from 'react-i18next';
import { useRedirectFromUrl } from '@/src/utils/useRedirectFromUrl';
import LoginForm from '@/src/components/LoginForm';

export const PageLogin = () => {
  const { t } = useTranslation(['auth']);
  const queryCache = useQueryClient();
  const redirect = useRedirectFromUrl();

  return (
    <SlideIn>
      <Box px="2" py="4rem" w="22rem" maxW="full" m="auto">
        <Box
          p="6"
          borderRadius="md"
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'blackAlpha.400' }}
        >
          <Center>
            <Heading size="md" mb="4" data-test="login-page-heading">
              {t('auth:login.title')}
            </Heading>
          </Center>
          <LoginForm />
        </Box>
      </Box>
    </SlideIn>
  );
};
