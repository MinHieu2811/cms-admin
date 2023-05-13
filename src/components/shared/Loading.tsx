

import { Flex, Progress } from "@chakra-ui/react";
import ClientOnly from "./ClientOnly";
import { Viewport } from "./Viewport";

export const Loading = () => {
  return (
    <ClientOnly>
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
    </ClientOnly>
  );
};