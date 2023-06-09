import React from 'react';

import { useTranslation } from 'react-i18next';
import { FiUsers } from 'react-icons/fi';
import { GoBook } from 'react-icons/go';
import { Link, useLocation } from 'react-router-dom';

import { Nav, NavGroup, NavItem } from '@/src/components/Nav';

export const AdminNav = () => {
  const { t } = useTranslation(['admin']);
  const { pathname } = useLocation();
  const isActive = (to: string) => pathname.startsWith(to);
  return (
    <Nav>
      <NavGroup title={t('admin:nav.administration') as string}>
        <NavItem
          as={Link}
          to="/admin/users"
          isActive={isActive('/admin/users')}
          icon={FiUsers}
        >
          {t('admin:nav.users')}
        </NavItem>
        <NavItem
          as={Link}
          to="/admin/api"
          isActive={isActive('/admin/api')}
          icon={GoBook}
        >
          {t('admin:nav.apiDocumentation')}
        </NavItem>
      </NavGroup>
    </Nav>
  );
};
