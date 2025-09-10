import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light", // or "dark"
  useSystemColorMode: false, // set to true if you want auto match system
};

const theme = extendTheme({ config });

export default theme;
