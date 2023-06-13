import React, { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  ScaleFade,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { Trans, useTranslation } from 'react-i18next';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

import { FieldInput } from '@/src/components/FieldInput';
import { SlideIn } from '@/src/components/SlideIn';
import { useToastError, useToastSuccess } from '@/src/components/Toast';
import { useRtl } from '@/src/hooks';
import {
  useResetCodeInit,
  useResetPass,
  useResetPasswordInit,
} from '@/src/services/account/account.service';
import { useRedirectFromUrl } from '@/src/utils';

enum STEPS {
  EMAIL = 0,
  RESET_CODE = 1,
  UPDATE_PASS = 2,
}

export const PageResetPasswordRequest = () => {
  const { rtlValue } = useRtl();
  const { t } = useTranslation(['account']);
  const [step, setStep] = useState(STEPS?.EMAIL);

  const resetPasswordInitForm = useForm();

  const resetCodeForm = useForm();

  const toastError = useToastError();

  const toastSuccess = useToastSuccess();

  const [accountEmail, setAccountEmail] = useState('');
  const navigate = useRedirectFromUrl('/login');

  const resetPasswordInit = useResetPasswordInit({
    onMutate: () => {
      setAccountEmail(resetPasswordInitForm.values?.email);
    },
    onSuccess: () => {
      onNext();
    },
    onError: (error) => {
      const { title } = error?.response?.data || {};
      toastError({
        title: t('account:resetPassword.feedbacks.initError.title'),
        description: title,
      });
    },
  });

  const resetCode = useResetCodeInit({
    onSuccess: () => {
      onNext();
    },
    onError: (error) => {
      const { title } = error?.response?.data || {};
      toastError({
        title: t('account:resetPassword.feedbacks.initError.title'),
        description: title,
      });
    },
  });

  const resetPassword = useResetPass({
    onSuccess: () => {
      toastSuccess({
        title: t("account:resetPasswordModal.success.title"),
        description: t("account:resetPasswordModal.success.description")
      })
      navigate();
    },
    onError: (error) => {
      const { title } = error?.response?.data || {};
      toastError({
        title: t('account:resetPassword.feedbacks.initError.title'),
        description: title,
      });
    },
  });

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const actionLabel = useMemo(() => {
    if (step === STEPS?.EMAIL) {
      return t('account:resetPassword.actions.send');
    }

    if (step === STEPS?.RESET_CODE) {
      return t('account:resetCode.actions.send');
    }

    return 'Update password';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS?.EMAIL) {
      return undefined;
    }

    return t('account:resetCode.actions.cancel');
  }, [step]);

  const submitResetPasswordInit = async (values: TODO) => {
    await resetPasswordInit.mutate(values.email);
  };

  const submitResetCode = async (values: TODO) => {
    await resetCode.mutate(values.code);
  };

  const submitResetPassword = async (values: TODO) => {
    resetPassword.mutate({
      email: values?.email,
      newPassword: values?.newPassword,
      oldPassword: values?.oldPassword,
    });
  };
  let bodyContent = (
    <SlideIn>
      <Box p="2" pb="4rem" w="22rem" maxW="full" m="auto">
        <Box
          p="6"
          borderRadius="md"
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'blackAlpha.400' }}
        >
          <Heading size="lg">{t('account:resetPassword.title')}</Heading>
          <Formiz
            id="reset-password-init-form"
            onValidSubmit={submitResetPasswordInit}
            connect={resetPasswordInitForm}
          >
            <form noValidate onSubmit={resetPasswordInitForm.submit}>
              <FieldInput
                name="email"
                label={t('account:data.email.label')}
                my="6"
                helper={t('account:data.email.resetHelper')}
                required={t('account:data.email.required') as string}
                validations={[
                  {
                    rule: isEmail(),
                    message: t('account:data.email.invalid') as string,
                  },
                ]}
              />
              <Flex>
                <Button
                  leftIcon={rtlValue(<FiArrowLeft />, <FiArrowRight />)}
                  as={RouterLink}
                  to="/login"
                  variant="link"
                >
                  {t('account:resetPassword.actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="@primary"
                  ms="auto"
                  isLoading={resetPasswordInit.isLoading}
                >
                  {actionLabel}
                </Button>
              </Flex>
            </form>
          </Formiz>
        </Box>
      </Box>
    </SlideIn>
  );

  if (step === STEPS?.UPDATE_PASS) {
    return (
      <SlideIn>
        <Box p="2" pb="4rem" w="22rem" maxW="full" m="auto">
          <Box
            p="6"
            borderRadius="md"
            boxShadow="md"
            bg="white"
            _dark={{ bg: 'blackAlpha.400' }}
          >
            <Heading size="lg">{t('account:resetPassword.title')}</Heading>
            <Formiz
              autoForm
              id="reset-password-form"
              onValidSubmit={submitResetPassword}
              connect={resetPassword}
            >
              {/* <form noValidate onSubmit={resetPasswordForm.submit}> */}
              <FieldInput name="email" type="text" display="none" />
              <FieldInput
                name="oldPassword"
                type="password"
                label={t('account:resetPasswordModal.oldPassword.label')}
                my="6"
                helper={t('account:resetPasswordModal.oldPassword.resetHelper')}
                required={
                  t('account:resetPasswordModal.oldPassword.required') as string
                }
              />
              <FieldInput
                name="newPassword"
                type="password"
                label={t('account:resetPasswordModal.newPassword.label')}
                my="6"
                helper={t('account:resetPasswordModal.newPassword.resetHelper')}
                required={
                  t('account:resetPasswordModal.newPassword.required') as string
                }
              />
              <Flex>
                <Button
                  leftIcon={rtlValue(<FiArrowLeft />, <FiArrowRight />)}
                  onClick={onBack}
                  variant="solid"
                >
                  {secondaryActionLabel}
                </Button>
                <Button
                  type="submit"
                  variant="@primary"
                  ms="auto"
                  isLoading={resetPassword.isLoading}
                >
                  {t('account:resetPasswordModal.send')}
                </Button>
              </Flex>
              {/* </form> */}
            </Formiz>
          </Box>
        </Box>
      </SlideIn>
    );
  }

  if (step === STEPS?.RESET_CODE) {
    return (
      <Center p="4" m="auto">
        <ScaleFade initialScale={0.9} in>
          <Alert
            status="success"
            variant="solid"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="lg"
            px="8"
            py="4"
            maxW="xl"
          >
            <Box fontSize="3rem">✉️</Box>
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {t('account:resetPassword.feedbacks.initSuccess.title')}
            </AlertTitle>
            <AlertDescription>
              <Trans
                t={t}
                i18nKey="account:resetPassword.feedbacks.initSuccess.description"
                values={{ email: accountEmail }}
              />
            </AlertDescription>
          </Alert>
          <SlideIn>
            <Box p="2" pb="4rem" w="25rem" maxW="full" m="auto" mt="2rem">
              <Box
                p="6"
                borderRadius="md"
                boxShadow="md"
                bg="white"
                _dark={{ bg: 'blackAlpha.400' }}
              >
                <Heading size="lg">{t('account:resetCode.title')}</Heading>
                <Formiz
                  id="reset-password-init-form"
                  onValidSubmit={submitResetCode}
                  connect={resetCodeForm}
                >
                  <form noValidate onSubmit={resetCodeForm.submit}>
                    <FieldInput
                      name="code"
                      label={t('account:resetCode.label')}
                      my="6"
                      helper={t('account:resetCode.textHelper')}
                      required={t('account:data.email.required') as string}
                    />
                    <Flex>
                      <Button
                        leftIcon={rtlValue(<FiArrowLeft />, <FiArrowRight />)}
                        variant="solid"
                        onClick={onBack}
                      >
                        {secondaryActionLabel}
                      </Button>
                      <Button
                        type="submit"
                        variant="@primary"
                        ms="auto"
                        isLoading={resetPasswordInit.isLoading}
                      >
                        {actionLabel}
                      </Button>
                    </Flex>
                  </form>
                </Formiz>
              </Box>
            </Box>
          </SlideIn>
        </ScaleFade>
      </Center>
    );
  }

  return bodyContent;
};
