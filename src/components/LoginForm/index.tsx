import React from 'react';

import { Box, BoxProps, Button, Flex, Stack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useToastError } from '../Toast';
import { FieldInput } from '../FieldInput';
import { useLogin } from '@/src/services/auth/login.service';

interface LoginFormProps extends BoxProps {
  onSuccess: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  ...rest
}: LoginFormProps) => {
  const { t } = useTranslation(['auth']);
  const form = useForm({ subscribe: 'form' });
  const toastError = useToastError();

  const login = useLogin({
    onSuccess,
    onError: (error) => {
      toastError({
        title: t('auth:login.feedbacks.loginError.title'),
        description: error?.response?.data?.title,
      });
    },
  });

  return (
    <Box {...rest}>
      <Formiz
        id="login-form"
        autoForm
        onValidSubmit={login.mutate}
        connect={form}
      >
        <Stack spacing="4">
          <FieldInput
            name="email"
            label={t('auth:data.username.label')}
            required={t('auth:data.username.required') as string}
          />
          <FieldInput
            name="password"
            type="password"
            label={t('auth:data.password.label')}
            required={t('auth:data.password.required') as string}
          />
          <Flex>
            <Button
              as={RouterLink}
              to="/account/reset"
              size="sm"
              variant="link"
              whiteSpace="initial"
            >
              {t('auth:login.actions.forgotPassword')}
            </Button>
            <Button
              isLoading={login.isLoading}
              isDisabled={form.isSubmitted && !form.isValid}
              type="submit"
              variant="@primary"
              ms="auto"
            >
              {t('auth:login.actions.login')}
            </Button>
          </Flex>
        </Stack>
      </Formiz>
    </Box>
  );
};

export default LoginForm;
