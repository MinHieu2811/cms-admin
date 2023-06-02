import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { ErrorPage } from '@/src/router/dashboard/ErrorPage';
import { PageUsers } from './PageUser';
import { PageUserCreate } from './CreateUser';
import { PageUserUpdate } from './UpdateUserPage';

const AdminUsersRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageUsers />} />
      <Route path="create" element={<PageUserCreate />} />
      <Route path=":userId" element={<PageUserUpdate />} />
      <Route path="*" element={<ErrorPage errorCode={404} />} />
    </Routes>
  );
};

export default AdminUsersRoutes;
