import React from 'react';

import Head from 'next/head';
import { useTranslation } from 'react-i18next';

import { ErrorPage } from '@/src/router/dashboard/ErrorPage';

const Page500 = () => {
  const { t } = useTranslation(['components']);
  return (
    <>
      <Head>
        <title>{t('components:errorPage.default.title')}</title>
      </Head>
      <ErrorPage errorCode={500} />
    </>
  );
};
export default Page500;
