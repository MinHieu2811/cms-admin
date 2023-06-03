import React from 'react';

import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { FieldInput } from '@/src/components/FieldInput';
import { FieldSelect } from '@/src/components/FieldSelect';
import { useToastError, useToastSuccess } from '@/src/components/Toast';
import { AVAILABLE_LANGUAGES } from '@/src/constants/i18next';
import { AccountNav } from '@/src/components/layout/AccountNav';
import {
  accountKeys,
  useAccount,
  useUpdateAccount,
} from '@/src/services/account/account.service';
import { Page, PageContent } from '@/src/components/layout';

export const PageProfile = () => {
  const { t } = useTranslation(['common', 'account']);
  const { account } = useAccount();
  const generalInformationForm = useForm();
  const queryClient = useQueryClient();

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const updateAccount = useUpdateAccount({
    onError: (error) => {
      const { title } = error?.response?.data || {};
      toastError({
        title: t('account:profile.feedbacks.updateError.title'),
        description: title,
      });
    },
    onSuccess: () => {
      toastSuccess({
        title: t('account:profile.feedbacks.updateSuccess.title'),
      });
      queryClient.invalidateQueries(accountKeys.account);
    },
  });

  const submitGeneralInformation = async (values: TODO) => {
    const payload = {
      id: account?.id,
      ...values
    }
    await updateAccount.mutate(payload);
  };

  return (
    <Page nav={<AccountNav />}>
      <PageContent>
        <Heading size="md" mb="4">
          {t('account:profile.title')}
        </Heading>
        {account && (
          <Formiz
            id="account-form"
            onValidSubmit={submitGeneralInformation}
            connect={generalInformationForm}
            initialValues={account}
          >
            <form noValidate onSubmit={generalInformationForm.submit}>
              <Stack
                direction="column"
                p="6"
                borderRadius="lg"
                spacing="6"
                shadow="md"
                bg="white"
                _dark={{ bg: 'blackAlpha.400' }}
              >
                <Stack direction={{ base: 'column', sm: 'row' }} spacing="6">
                  <FieldInput
                    name="name"
                    label={t('account:data.username.label')}
                    required={t('account:data.username.required') as string}
                  />
                </Stack>
                <FieldInput
                  name="email"
                  label={t('account:data.email.label')}
                  required={t('account:data.email.required') as string}
                  validations={[
                    {
                      rule: isEmail(),
                      message: t('account:data.email.invalid') as string,
                    },
                  ]}
                />
                <FieldSelect
                  name="langKey"
                  label={t('account:data.language.label')}
                  options={AVAILABLE_LANGUAGES.map(({ key }) => ({
                    label: t(`common:languages.${key}`),
                    value: key,
                  }))}
                />
                <Flex>
                  <Button
                    type="submit"
                    variant="solid"
                    ms="auto"
                    isLoading={updateAccount.isLoading}
                  >
                    {t('account:profile.actions.save')}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Formiz>
        )}
      </PageContent>
    </Page>
  );
};
