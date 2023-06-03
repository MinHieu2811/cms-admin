import React from 'react';

import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { isMaxLength, isMinLength, isPattern } from '@formiz/validations';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/src/components/FieldInput';
import { useToastError, useToastSuccess } from '@/src/components/Toast';
import { AccountNav } from '@/src/components/layout/AccountNav';
import { useUpdatePassword } from '@/src/services/account/account.service';
import { Page, PageContent } from '@/src/components/layout';

export const PagePassword = () => {
  const { t } = useTranslation(['account']);
  const changePasswordForm = useForm();

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const updatePassword = useUpdatePassword({
    onError: (error) => {
      const { title } = error?.response?.data || {};
      if (title === 'Incorrect password') {
        changePasswordForm.invalidateFields({
          currentPassword: t('account:data.currentPassword.incorrect'),
        });
        return;
      }
      toastError({
        title: t('account:password.feedbacks.updateError.title'),
        description: title,
      });
    },
    onSuccess: () => {
      toastSuccess({
        title: t('account:password.feedbacks.updateSuccess.title'),
      });
      changePasswordForm.reset();
    },
  });

  const submitUpdatePassword = async (values: TODO) => {
    const { currentPassword, newPassword } = values;
    await updatePassword.mutate({ currentPassword, newPassword });
  };

  const passwordValidations = [
    {
      rule: isMinLength(4),
      message: t('account:data.password.tooShort', { min: 8 }),
    },
    {
      rule: isMaxLength(50),
      message: t('account:data.password.tooLong', { max: 50 }),
    },
  ];

  return (
    <Page nav={<AccountNav />}>
      <PageContent>
        <Heading size="md" mb="4">
          {t('account:password.title')}
        </Heading>
        <Formiz
          id="password-form"
          onValidSubmit={submitUpdatePassword}
          connect={changePasswordForm}
        >
          <form noValidate onSubmit={changePasswordForm.submit}>
            <Stack
              direction="column"
              p="6"
              borderRadius="lg"
              spacing="6"
              shadow="md"
              bg="white"
              _dark={{ bg: 'blackAlpha.400' }}
            >
              <FieldInput
                name="currentPassword"
                type="password"
                label={t('account:data.currentPassword.label')}
                required={t('account:data.currentPassword.required') as string}
                validations={passwordValidations}
              />
              <FieldInput
                name="newPassword"
                type="password"
                label={t('account:data.newPassword.label')}
                required={t('account:data.newPassword.required') as string}
                validations={[
                  ...passwordValidations,
                  {
                    rule: isPattern(
                      '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=.-_*])([a-zA-Z0-9@#$%^&+=*.-_]){8,}$'
                    ),
                    message: t('account:data.newPassword.invalid') as string,
                  },
                ]}
              />
              <FieldInput
                name="confirmNewPassword"
                type="password"
                label={t('account:data.confirmNewPassword.label')}
                required={
                  t('account:data.confirmNewPassword.required') as string
                }
                validations={[
                  ...passwordValidations,
                  {
                    rule: (value) =>
                      value === changePasswordForm?.values?.newPassword,
                    message: t(
                      'account:data.confirmNewPassword.notEqual'
                    ) as string,
                    deps: [changePasswordForm?.values?.newPassword],
                  },
                ]}
              />
              <Flex>
                <Button
                  type="submit"
                  variant="@primary"
                  ms="auto"
                  isLoading={updatePassword.isLoading}
                >
                  {t('account:password.actions.changePassword')}
                </Button>
              </Flex>
            </Stack>
          </form>
        </Formiz>
      </PageContent>
    </Page>
  );
};
