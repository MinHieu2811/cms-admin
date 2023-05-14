import { extendTheme } from "@chakra-ui/react";

import { config } from "./config";
import foundations from "./foundations";

export const theme = extendTheme({
  config,
  ...foundations
})