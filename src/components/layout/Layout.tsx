import { Flex, useDisclosure } from '@chakra-ui/react';
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutContext } from './LayoutContext';
import { useAuthContext } from '@/src/services/auth/AuthContext';
import { Viewport } from '../shared/Viewport';
import { TopBar } from './Topbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const nav = useDisclosure();
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    window?.scrollTo(0, 0);
  }, [pathname]);

  const providerValue = useMemo(
    () => ({
      isFocusMode,
      setIsFocusMode,
      navIsOpen: nav.isOpen,
      navOnClose: nav.onClose,
      navOnOpen: nav.onOpen,
    }),
    [isFocusMode, nav?.isOpen, nav?.onClose, nav?.onOpen, setIsFocusMode]
  );
  return (
    <LayoutContext.Provider value={providerValue}>
      <Viewport>
        {isAuthenticated && !isFocusMode && <TopBar />}
        <Flex flex="1" direction="column">
          {children}
        </Flex>
      </Viewport>
    </LayoutContext.Provider>
  );
};
