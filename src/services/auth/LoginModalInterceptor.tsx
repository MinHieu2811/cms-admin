import React, { useEffect, useRef } from 'react';

import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from './AuthContext';
import LoginForm from '@/src/components/LoginForm';
import { axiosInstace } from '@/src/config/axios';
import { AxiosError } from 'axios';

export const LoginModalInterceptor = () => {
  const { t } = useTranslation(['auth']);
  const loginModal = useDisclosure();
  const authContext = useAuthContext();
  const queryCache = useQueryClient();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const openLoginModal = loginModal.onOpen;

  useEffect(() => {
    const interceptor = axiosInstace.interceptors.response.use(
      (res) => {
        return res
      },
      (error: AxiosError) => {
        console.log('error', error);
        if (
          error?.response?.status === 401 &&
          pathnameRef.current !== '/login'
        ) {
          queryCache.cancelQueries();
          openLoginModal();
        }
        throw error;
      }
    );

    return () => axiosInstace.interceptors.response.eject(interceptor);
  }, [openLoginModal, authContext?.updateToken, queryCache]);

  useEffect(() => {
    if (loginModal.isOpen && pathname !== pathnameRef.current) {
      authContext?.updateToken(null);
      loginModal.onClose();
    }
  }, [loginModal, authContext?.updateToken, pathname]);

  const handleLogin = () => {
    queryCache.refetchQueries();
    loginModal.onClose();
  };

  const handleClose = () => {
    authContext?.updateToken(null);
    loginModal.onClose();
    navigate('/login');
  };

  return (
    <Modal
      isOpen={loginModal.isOpen && authContext?.isAuthenticated}
      onClose={handleClose}
      closeOnOverlayClick={false}
      trapFocus={false}
    >
      <ModalOverlay style={{ backdropFilter: 'blur(6px)' }} />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody p="6">
          <Heading size="lg">{t('auth:interceptor.title')}</Heading>
          <Text mb="2">{t('auth:interceptor.description')}</Text>
          <LoginForm onSuccess={handleLogin}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
