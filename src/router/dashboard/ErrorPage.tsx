import React from 'react';

import { Button, Center, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/src/components/Logo';

const SupportedErrors: Record<
  'default' | 403 | 404,
  { illustration?: number }
> = {
  default: { illustration: 500 },
  403: { illustration: 403 },
  404: { illustration: 404 },
};

export const ErrorPage = ({ errorCode }: { errorCode?: number }) => {
  const { t } = useTranslation(['components']);
  const errorType =
    errorCode && errorCode in SupportedErrors
      ? (errorCode as keyof typeof SupportedErrors)
      : 'default';
  const illustration =
    SupportedErrors[errorType].illustration ??
    SupportedErrors.default.illustration ??
    null;

  return (
    <Center flex="1" p="8">
      <Stack
        direction={{ base: 'column-reverse', md: 'column' }}
        align="center"
        spacing={4}
      >
        <Stack spacing={3}>
          <Text fontSize="5xl">{illustration}</Text>
        </Stack>
        <Stack
          textAlign={{ base: 'center', md: 'center' }}
          alignItems={{ base: 'center', md: 'center' }}
        >
          <Heading>{t(`components:errorPage.${errorType}.title`)}</Heading>
          <Text>{t(`components:errorPage.${errorType}.description`)}</Text>
          {!!errorCode && (
            <Text
              color="gray.500"
              _dark={{ color: 'gray.400' }}
              fontSize="sm"
              mt={4}
            >
              {t(`components:errorPage.errorCode`, {
                code: errorCode,
              })}
            </Text>
          )}
          <Link href="/" passHref>
            <Button marginY={4}>Back to Homepage</Button>
          </Link>
        </Stack>
      </Stack>
    </Center>
  );
};
