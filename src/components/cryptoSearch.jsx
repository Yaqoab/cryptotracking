import React, { useState, useEffect } from "react";
import { searchCoins } from "../services/coinGekoAPI";
import {
  Box,
  Flex,
  Input,
  Button,
  List,
  ListItem,
  Image,
  Text,
  Spinner,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function CryptoSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 live search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchCoins(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 400); // wait 400ms after typing stops

    return () => clearTimeout(delayDebounce); // cleanup on re-type
  }, [query]);

  return (
    <Box my={6} position="relative" maxW="800px" mx="auto">
      {/* Search Bar */}
      <Flex gap={2} mb={4}>
        <Input
          placeholder="Search any coin..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // bg="white"
        />

        <Button colorScheme="blue" onClick={() => setQuery(query)}>
          Search
        </Button>
      </Flex>

      {loading && <Spinner mt={2} />}

      {/* Floating Search Results */}
      {results.length > 0 && (
        <Box
        position="absolute"
        top="100%"
        left={0}
        right={0}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        maxH="300px"
        overflowY="auto"
        bg="white"          
        zIndex={30}         
      >
          <List spacing={2} p={2}>
            {results.map((coin) => (
              <Link
                as={RouterLink}
                to={`/coin/${coin.id}`}
                key={coin.id}
                _hover={{ textDecoration: "underline", color: "blue.400" }}
              >
                <ListItem>
                  <Flex align="center" gap={3}>
                    <Image src={coin.image} boxSize="24px" alt={coin.name} />
                    <Text>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </Text>
                  </Flex>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
}
