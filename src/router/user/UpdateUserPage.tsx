import React from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  SkeletonText,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Formiz, useForm } from '@formiz/core';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorPage } from '@/src/router/dashboard/ErrorPage';
import { useToastError, useToastSuccess } from '@/src/components/Toast';
import { useUser, useUserUpdate } from '@/src/services/user/user.service';
import {
  Loader,
  Page,
  PageBottomBar,
  PageContent,
  PageTopBar,
} from '@/src/components/layout';

import { UserForm } from '@/src/components/FormUser';
import { UserStatus } from '@/src/components/UserStatus';

export const PageUserUpdate = () => {
  const { t } = useTranslation(['common', 'users']);

  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useUser(userId, {
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });

  const form = useForm({ subscribe: false });

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const { mutate: editUser, isLoading: editUserIsLoading } = useUserUpdate({
    onError: (error) => {
      if (error.response) {
        const { title, errorKey } = error.response.data;
        toastError({
          title: t('users:update.feedbacks.updateError.title'),
          description: title,
        });
        switch (errorKey) {
          case 'userexists':
            form.invalidateFields({
              login: t('users:data.login.alreadyUsed'),
            });
            break;
          case 'emailexists':
            form.invalidateFields({
              email: t('users:data.email.alreadyUsed'),
            });
            break;
        }
      }
    },
    onSuccess: () => {
      toastSuccess({
        title: t('users:update.feedbacks.updateSuccess.title'),
      });
      navigate(-1);
    },
  });
  const submitEditUser = (values: TODO) => {
    const userToSend = {
      id: user.data?.id,
      ...values,
    };
    editUser(userToSend);
  };

  return (
    <Page containerSize="md" isFocusMode>
      <PageTopBar showBack onBack={() => navigate(-1)}>
        <HStack spacing="4">
          <Box flex="1">
            {user.isLoading || user.isError ? (
              <SkeletonText maxW="6rem" noOfLines={2} />
            ) : (
              <Stack spacing="0">
                <Heading size="sm">{user.data?.name}</Heading>
                <Text
                  fontSize="xs"
                  color="gray.600"
                  _dark={{ color: 'gray.300' }}
                >
                  {t('users:data.id.label')}: {user.data?.id}
                </Text>
              </Stack>
            )}
          </Box>
          {!!user && (
            <Box>
              <UserStatus isActivated={user.data?.activated} />
            </Box>
          )}
        </HStack>
      </PageTopBar>
      {user.isFetching && <Loader />}
      {user.isError && !user.isFetching && <ErrorPage errorCode={404} />}
      {!user.isError && !user.isFetching && (
        <Formiz
          id="create-user-form"
          onValidSubmit={submitEditUser}
          connect={form}
          initialValues={user?.data}
        >
          <form noValidate onSubmit={form.submit}>
            <PageContent>
              <UserForm containPassword={false}/>
            </PageContent>
            <PageBottomBar>
              <ButtonGroup justifyContent="space-between">
                <Button onClick={() => navigate(-1)}>
                  {t('common:actions.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="@primary"
                  isLoading={editUserIsLoading}
                >
                  {t('users:update.action.save')}
                </Button>
              </ButtonGroup>
            </PageBottomBar>
          </form>
        </Formiz>
      )}
    </Page>
  );
};
