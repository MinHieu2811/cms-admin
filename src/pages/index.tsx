import React, { useEffect } from 'react';

import { Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { Loader } from '@/src/components/layout';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/app/dashboard');
  }, [router]);

  return (
    <Center flex="1">
      <Loader />
    </Center>
  );
};
export default Index;
