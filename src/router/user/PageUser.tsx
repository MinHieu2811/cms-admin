import { DataList, DataListCell, DataListFooter, DataListHeader, DataListRow } from "@/src/components/DataList/DataList";
import { Pagination, PaginationButtonFirstPage, PaginationButtonLastPage, PaginationButtonNextPage, PaginationButtonPrevPage, PaginationInfo } from "@/src/components/Pagination";
import { DateAgo } from "@/src/components/TimeAgo";
import { Page, PageContent } from "@/src/components/layout";
import { AdminNav } from "@/src/components/layout/AdminNav";
import { UserStatus } from "@/src/components/shared/UserStatus";
import { usePaginationFromUrl } from "@/src/hooks/usePaginationFromUrl";
import { useUserList } from "@/src/services/user/user.service";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Avatar, Badge, Box, Button, Center, Code, HStack, Heading, IconButton, LinkBox, LinkOverlay, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { Link } from "react-router-dom";

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
            <DataListCell colName="login" colWidth="2">
              {t('users:data.login.label')} / {t('users:data.email.label')}
            </DataListCell>
            <DataListCell
              colName="id"
              colWidth="4rem"
              isVisible={{ base: false, lg: true }}
            >
              {t('users:data.id.label')}
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
          {users.data?.content.map((user) => (
            <DataListRow as={LinkBox} key={user.id}>
              <DataListCell colName="login">
                <HStack maxW="100%">
                  <Avatar size="sm" name={user.login} mx="1" />
                  <Box minW="0">
                    <Text noOfLines={1} maxW="full" fontWeight="bold">
                      <LinkOverlay as={Link} to={user.login}>
                        {user.login}
                      </LinkOverlay>
                    </Text>
                    <Text
                      noOfLines={1}
                      maxW="full"
                      fontSize="sm"
                      color="gray.600"
                      _dark={{ color: 'gray.300' }}
                    >
                      {user.email}
                    </Text>
                  </Box>
                </HStack>
              </DataListCell>
              <DataListCell colName="id">
                <Code maxW="full" fontSize="xs">
                  {user.id}
                </Code>
              </DataListCell>
              <DataListCell colName="authorities">
                <Wrap>
                  {user.authorities?.map((authority) => (
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
                  {user.createdBy}
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
                  {user.lastModifiedBy}
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
                <UserStatus isActivated={user.activated} />
              </DataListCell>
              <DataListCell colName="actions">
                {/* <UserActions user={user} /> */}
              </DataListCell>
            </DataListRow>
          ))}
          <DataListFooter>
            <Pagination
              isLoadingPage={users.isLoadingPage}
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
