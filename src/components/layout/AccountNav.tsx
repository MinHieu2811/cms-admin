import React from 'react';

import { useTranslation } from 'react-i18next';
import { FiLock, FiUser } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

import { Nav, NavGroup, NavItem } from '@/src/components/Nav';

export const AccountNav = () => {
  const { t } = useTranslation(['account']);
  const { pathname } = useLocation();
  const isActive = (to: string) => pathname.startsWith(to);
  return (
    <Nav>
      <NavGroup title={t('account:nav.myAccount') as string}>
        <NavItem
          as={Link}
          to="/account/profile"
          isActive={isActive('/account/profile')}
          icon={FiUser}
        >
          {t('account:nav.profile')}
        </NavItem>
        <NavItem
          as={Link}
          to="/account/password"
          isActive={isActive('/account/password')}
          icon={FiLock}
        >
          {t('account:nav.password')}
        </NavItem>
      </NavGroup>
    </Nav>
  );
};
