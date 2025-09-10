import { Flex, Spinner, Text } from "@chakra-ui/react";

export default function Loader({ message = "Loading..." }) {
  return (
    <Flex
      justify="center"
      align="center"
      minH="200px"
      direction="column"
      gap={3}
    >
      <Spinner
        thickness="4px"
        speed="0.6s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text fontSize="md" color="gray.500">
        {message}
      </Text>
    </Flex>
  );
}
