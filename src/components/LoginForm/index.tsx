import React from 'react';

import { Box, BoxProps, Button, Flex, Stack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { Link as RouterLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useToastError } from '../Toast';
import { FieldInput } from '../FieldInput';
import { FaGithub, FaGoogle } from 'react-icons/fa';

import { signIn } from 'next-auth/react';

interface LoginFormProps extends BoxProps {}

export const LoginForm: React.FC<LoginFormProps> = ({
  ...rest
}: LoginFormProps) => {

  return (
    <Box {...rest}>
      <Stack spacing="4">
        <Button
          size="md"
          variant="solid"
          whiteSpace="initial"
          onClick={() =>
            signIn('google', {
              redirect: false,
              callbackUrl: '/app',
            })
          }
        >
          <FaGoogle size={20} style={{ marginRight: '10px' }} /> Log in with
          Google
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginForm;
