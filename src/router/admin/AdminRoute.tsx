import React from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { ErrorPage } from '@/src/router/dashboard/ErrorPage';
// import { PageApiDocumentation } from '@/spa/admin/api/PageApiDocumentation';

const AdminUsersRoutes = React.lazy(
  () => import('@/src/router/user/index')
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<AdminUsersRoutes />} />
        {/* <Route path="users/*" element={<AdminUsersRoutes />} />
      <Route path="api/*" element={<PageApiDocumentation />} /> */}
        <Route path="*" element={<ErrorPage errorCode={404} />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
