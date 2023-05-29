import { ConfirmMenuItem } from '@/src/components/ConfirmMenuItem';
import {
  DataList,
  DataListCell,
  DataListFooter,
  DataListHeader,
  DataListRow,
} from '@/src/components/DataList/DataList';
import { Icon } from '@/src/components/Icons';
import {
  Pagination,
  PaginationButtonFirstPage,
  PaginationButtonLastPage,
  PaginationButtonNextPage,
  PaginationButtonPrevPage,
  PaginationInfo,
} from '@/src/components/Pagination';
import { DateAgo } from '@/src/components/TimeAgo';
import { useToastError, useToastSuccess } from '@/src/components/Toast';
import { Page, PageContent } from '@/src/components/layout';
import { AdminNav } from '@/src/components/layout/AdminNav';
import { ActionsButton } from '@/src/components/shared/ActionButton';
import { UserStatus } from '@/src/components/shared/UserStatus';
import { usePaginationFromUrl } from '@/src/hooks/usePaginationFromUrl';
import {
  useUserList,
  useUserRemove,
  useUserUpdate,
} from '@/src/services/user/user.service';
import { User } from '@/src/types/account.types';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Code,
  HStack,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuProps,
  Portal,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiCheckCircle,
  FiEdit,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiXCircle,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

type UserActionProps = Omit<MenuProps, 'children'> & {
  user: User;
};
const UserActions = ({ user, ...rest }: UserActionProps) => {
  const { t } = useTranslation(['common', 'users']);
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const userUpdate = useUserUpdate({
    onSuccess: ({ activated, login }) => {
      if (activated) {
        toastSuccess({
          title: t('users:feedbacks.activateUserSuccess.title'),
          description: t('users:feedbacks.activateUserSuccess.description', {
            login,
          }),
        });
      } else {
        toastSuccess({
          title: t('users:feedbacks.deactivateUserSuccess.title'),
          description: t('users:feedbacks.deactivateUserSuccess.description', {
            login,
          }),
        });
      }
    },
    onError: (_, { activated, login }) => {
      if (activated) {
        toastError({
          title: t('users:feedbacks.activateUserError.title'),
          description: t('users:feedbacks.activateUserError.description', {
            login,
          }),
        });
      } else {
        toastError({
          title: t('users:feedbacks.deactivateUserError.title'),
          description: t('users:feedbacks.deactivateUserError.description', {
            login,
          }),
        });
      }
    },
  });

  const activateUser = useCallback(
    () => userUpdate.mutate({ ...user, activated: true }),
    []
  );
  const deactivateUser = useCallback(
    () => userUpdate.mutate({ ...user, activated: false }),
    []
  );
  const isActionsLoading = userUpdate.isLoading;

  const userRemove = useUserRemove({
    onSuccess: (_, { id }) => {
      toastSuccess({
        title: t('users:feedbacks.deleteUserSuccess.title'),
        description: t('users:feedbacks.deleteUserSuccess.description', {
          id,
        }),
      });
    },
    onError: (_, { id }) => {
      toastError({
        title: t('users:feedbacks.deleteUserError.title'),
        description: t('users:feedbacks.deleteUserError.description', {
          id,
        }),
      });
    },
  });

  const removeUser = () => userRemove?.mutate(user)
  const isRemovalLoading = userRemove?.isLoading

  return (
    <Menu isLazy {...rest} placement="left-start">
      <MenuButton as={ActionsButton} isLoading={isActionsLoading} />
      <Portal>
        <MenuList>
          <MenuItem
            as={Link}
            to={user.login}
            icon={<Icon icon={FiEdit} fontSize="lg" color="gray.400" />}
          >
            {t('common:actions.edit')}
          </MenuItem>
          {user.activated ? (
            <MenuItem
              onClick={deactivateUser}
              icon={<Icon icon={FiXCircle} fontSize="lg" color="gray.400" />}
            >
              {t('common:actions.deactivate')}
            </MenuItem>
          ) : (
            <MenuItem
              onClick={activateUser}
              icon={
                <Icon icon={FiCheckCircle} fontSize="lg" color="gray.400" />
              }
            >
              {t('common:actions.activate')}
            </MenuItem>
          )}
          <MenuDivider />
          <ConfirmMenuItem
            icon={<Icon icon={FiTrash2} fontSize="lg" color="gray.400" />}
            onClick={removeUser}
          >
            {t('common:actions.delete')}
          </ConfirmMenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export const PageUsers = () => {
  const { t } = useTranslation(['users']);
  const { page, setPage } = usePaginationFromUrl();
  const pageSize = 20;
  const users = useUserList({
    page: page - 1,
    size: pageSize,
  });

  return (
    <Page containerSize="xl" nav={<AdminNav />}>
      <PageContent>
        <HStack mb="4">
          <Box flex="1">
            <Heading size="md">{t('users:list.title')}</Heading>
          </Box>
          <Box>
            <Button
              display={{ base: 'none', sm: 'flex' }}
              as={Link}
              to="create"
              variant="@primary"
              leftIcon={<FiPlus />}
            >
              {t('users:list.actions.createUser')}
            </Button>
            <IconButton
              display={{ base: 'flex', sm: 'none' }}
              aria-label={t('users:list.actions.createUser')}
              as={Link}
              to="create"
              size="sm"
              variant="@primary"
              icon={<FiPlus />}
            />
          </Box>
        </HStack>

        <DataList>
          <DataListHeader isVisible={{ base: false, md: true }}>
            <DataListCell
              colName="id"
              colWidth="8rem"
              isVisible={{ base: false, lg: true }}
            >
              {t('users:data.id.label')}
            </DataListCell>
            <DataListCell colName="login" colWidth="2">
              {t('users:data.login.label')} / {t('users:data.email.label')}
            </DataListCell>
            <DataListCell
              colName="authorities"
              isVisible={{ base: false, lg: true }}
            >
              {t('users:data.authorities.label')}
            </DataListCell>
            <DataListCell
              colName="created"
              isVisible={{ base: false, lg: true }}
            >
              {t('users:data.createdBy.label')}
            </DataListCell>
            <DataListCell
              colName="lastModified"
              isVisible={{ base: false, md: true }}
            >
              {t('users:data.modifiedBy.label')}
            </DataListCell>
            <DataListCell
              colName="status"
              colWidth={{ base: '2rem', md: '0.5' }}
              align="center"
            >
              <Box as="span" display={{ base: 'none', md: 'block' }}>
                {t('users:data.status.label')}
              </Box>
            </DataListCell>
            <DataListCell colName="actions" colWidth="4rem" align="flex-end" />
          </DataListHeader>
          {users.isError && (
            <Center p={4}>
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>
                  {t('users:feedbacks.loadingUserError.title')}
                </AlertTitle>
                <AlertDescription>
                  {t('users:feedbacks.loadingUserError.description')}
                  <Button
                    colorScheme="error"
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiRefreshCw />}
                    isLoading={users.isLoadingPage}
                    onClick={() => users.refetch()}
                  >
                    {t('users:list.actions.refetch')}
                  </Button>
                </AlertDescription>
              </Alert>
            </Center>
          )}
          {users?.data?.content?.map((user) => (
            <DataListRow as={LinkBox} key={user?.id}>
              <DataListCell colName="id" colWidth={4}>
                <Code maxW="full" fontSize="xs">
                  {user?.id}
                </Code>
              </DataListCell>
              <DataListCell colName="login" colWidth={2}>
                <HStack maxW="100%">
                  <Avatar size="sm" name={user?.name} mx="1" />
                  <Box minW="0">
                    <Text noOfLines={1} maxW="full" fontWeight="bold">
                      <LinkOverlay as={Link} to={user?.id}>
                        {user?.name}
                      </LinkOverlay>
                    </Text>
                    <Text
                      noOfLines={1}
                      maxW="full"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: 'gray.300' }}
                    >
                      {user?.email}
                    </Text>
                  </Box>
                </HStack>
              </DataListCell>
              <DataListCell colName="authorities">
                <Wrap>
                  {user?.authorities?.map((authority) => (
                    <WrapItem key={authority}>
                      <Badge size="sm">{authority}</Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              </DataListCell>
              <DataListCell
                colName="created"
                fontSize="sm"
                position="relative"
                pointerEvents="none"
              >
                <Text noOfLines={1} maxW="full">
                  {user?.createdBy}
                </Text>
                {!!user?.createdAt && (
                  <Text
                    noOfLines={1}
                    maxW="full"
                    pointerEvents="auto"
                    color="gray.600"
                    _dark={{ color: 'gray.300' }}
                  >
                    <DateAgo date={user.createdAt} />
                  </Text>
                )}
              </DataListCell>
              <DataListCell
                colName="lastModified"
                fontSize="sm"
                position="relative"
                pointerEvents="none"
              >
                <Text noOfLines={1} maxW="full">
                  {user?.lastModifiedBy}
                </Text>
                {!!user?.updatedAt && (
                  <Text
                    noOfLines={1}
                    maxW="full"
                    pointerEvents="auto"
                    color="gray.600"
                    _dark={{ color: 'gray.300' }}
                  >
                    <DateAgo position="relative" date={user?.updatedAt} />
                  </Text>
                )}
              </DataListCell>
              <DataListCell colName="status">
                <UserStatus isActivated={user?.activated} />
              </DataListCell>
              <DataListCell colName="actions">
                <UserActions user={user} />
              </DataListCell>
            </DataListRow>
          ))}
          <DataListFooter>
            <Pagination
              isLoadingPage={users?.isLoadingPage}
              setPage={setPage}
              page={page}
              pageSize={pageSize}
              totalItems={users.data?.totalItems}
            >
              <PaginationButtonFirstPage />
              <PaginationButtonPrevPage />
              <PaginationInfo flex="1" />
              <PaginationButtonNextPage />
              <PaginationButtonLastPage />
            </Pagination>
          </DataListFooter>
        </DataList>
      </PageContent>
    </Page>
  );
};
