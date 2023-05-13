import React, { useEffect, useState } from 'react';

import { Flex, Progress } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

import { Viewport } from '@/src/components/shared/Viewport';

const Loading = () => (
  <Viewport>
    <Flex flex="1" align="flex-start">
      <Progress
        w="full"
        h="0.4rem"
        bg="gray.100"
        colorScheme="brand"
        isIndeterminate
      />
    </Flex>
  </Viewport>
);

const AppComponent = dynamic<unknown>(
  () => import('@/src/router/MainApp').then((mod) => mod.Mainsrc),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const src = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return isLoading ? <Loading /> : <AppComponent />;
};
export default src;
