import React from 'react';

import { Box, Button, Center, Heading } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';

import { SlideIn } from '@/src/components/SlideIn';
import { Logo } from '@/src/components/Logo';
import { useTranslation } from 'react-i18next';
import { useRedirectFromUrl } from '@/src/utils/useRedirectFromUrl';
import LoginForm from '@/src/components/LoginForm';
import { useAuthContext } from '@/src/services/auth/AuthContext';

export const PageLogin = () => {
  const { t } = useTranslation(['auth']);
  const queryCache = useQueryClient();
  const redirect = useRedirectFromUrl();
  const {isAuthenticated} = useAuthContext()
  console.log(isAuthenticated);

  const onLogin = () => {
    queryCache.clear()
    redirect()
  }

  return (
    <SlideIn>
      <Box px="2" py="4rem" w="22rem" maxW="full" m="auto">
        {/* <Logo h="3rem" mb="8" mx="auto" /> */}
        <Box
          p="6"
          borderRadius="md"
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'blackAlpha.400' }}
        >
          <Heading size="md" mb="4" data-test="login-page-heading">
            {t('auth:login.title')}
          </Heading>
          <LoginForm onSuccess={onLogin}/>
        </Box>
        <Center mt="8">
          <Button as={RouterLink} to="/register" variant="link">
            {t('auth:login.actions.needAccount')}{' '}
            <Box
              as="strong"
              ms="2"
              color="gray.600"
              _dark={{ color: 'gray.300' }}
            >
              {t('auth:login.actions.register')}
            </Box>
          </Button>
        </Center>
      </Box>
    </SlideIn>
  );
};
