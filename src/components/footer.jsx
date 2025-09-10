import {
    Box,
    Container,
    Stack,
    Text,
    Link,
    HStack,
    IconButton,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";
  
  export default function Footer() {
    return (
      <Box
        bg={useColorModeValue("gray.100", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
        py={6}
        mt={10}
      >
        <Container
          as={Stack}
          maxW="container.xl"
          direction={{ base: "column", md: "row" }}
          spacing={6}
          justify="space-between"
          align="center"
        >
          {/* Brand / Logo */}
          <Text fontWeight="bold" fontSize="lg">
            CryptoTracker © {new Date().getFullYear()}
          </Text>
  
          {/* Footer Nav Links */}
          <HStack spacing={6}>
            <Link href="#">Home</Link>
            <Link href="#">Market</Link>
            <Link href="#">News</Link>
            <Link href="#">Contact</Link>
          </HStack>
  
          {/* Social Media Icons */}
          <HStack spacing={4}>
            <IconButton
              as="a"
              href="https://twitter.com"
              aria-label="Twitter"
              icon={<FaTwitter />}
              variant="ghost"
            />
            <IconButton
              as="a"
              href="https://github.com"
              aria-label="Github"
              icon={<FaGithub />}
              variant="ghost"
            />
            <IconButton
              as="a"
              href="https://linkedin.com"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
              variant="ghost"
            />
          </HStack>
        </Container>
      </Box>
    );
  }
  