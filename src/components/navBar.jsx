import {
    Box,
    Flex,
    HStack,
    IconButton,
    Button,
    useDisclosure,
    Stack,
    Text,
    useColorMode,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { HamburgerIcon, CloseIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
  
  const Links = ["Home", "About", "Services", "Contact"];
  
  const NavLink = ({ children }) => (
    <Button
      px={3}
      py={2}
      variant="ghost"
      fontWeight="medium"
      _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
    >
      {children}
    </Button>
  );
  
  export default function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
  
    return (
      <Box
        bg={useColorModeValue("white", "gray.900")}
        px={4}
        boxShadow="sm"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Flex h={16} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            MyLogo
          </Text>
  
          {/* Desktop Links */}
          <HStack spacing={6} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
  
          <Flex alignItems="center">
            {/* Theme Toggle Button */}
            <IconButton
              size="md"
              mr={2}
              aria-label="Toggle theme"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
  
            {/* Mobile Menu Button */}
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: "none" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
        </Flex>
        
        {/* Mobile Menu */}
        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    );
  }
  