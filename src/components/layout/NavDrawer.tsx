'use client'

import React from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import { Logo } from '@/app/components/Logo';
import { useRtl } from '@/app/hooks/useRtl';
import { MainMenu, useLayoutContext } from '@/app/components/layout';

export const NavDrawer = ({ ...rest }) => {
  const { navIsOpen, navOnClose } = useLayoutContext();
  const { rtlValue } = useRtl();
  return (
    <Drawer
      isOpen={navIsOpen}
      placement={rtlValue('left', 'right')}
      onClose={() => navOnClose?.()}
      {...rest}
    >
      <DrawerOverlay>
        <DrawerContent
          bg="gray.800"
          color="white"
          pt="safe-top"
          pb="safe-bottom"
        >
          <DrawerCloseButton mt="safe-top" />
          <DrawerHeader>
            <Logo />
          </DrawerHeader>
          <DrawerBody p="2">
            <MainMenu direction="column" />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
