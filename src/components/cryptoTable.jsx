// src/components/CryptoTable.jsx
import React, { useEffect, useState } from "react";
import { getCoins } from "../services/coinGekoAPI";
import Loader from "./loader";
import {
  Container,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Box,
  Text,
  Button,
  HStack,
  Link,
  TableContainer,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatCurrency, formatPercent } from "../utils/format";
import { Link as RouterLink } from "react-router-dom";

// 🔹 Simple in-memory cache { page: data }
const coinsCache = {};

export default function CryptoTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);

  const stickyBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(false);

      // ✅ If cache exists, use it immediately
      if (coinsCache[page]) {
        setCoins(coinsCache[page]);
        setLoading(false);
        return;
      }

      try {
        const data = await getCoins(page, 50);
        coinsCache[page] = data; // ✅ cache result
        setCoins(data);
      } catch (err) {
        console.error("Error fetching market data", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [page]);

  if (loading && !coinsCache[page]) return <Loader />;

  if (error && !coins.length) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Text fontSize="lg" color="red.400" mb={4}>
          Failed to load coins data. Please try again.
        </Text>
        <Button
          colorScheme="teal"
          onClick={() => {
            setError(false);
            setLoading(true);
            // retry fetch inline
            (async () => {
              try {
                const data = await getCoins(page, 50);
                coinsCache[page] = data;
                setCoins(data);
              } catch (err) {
                console.error("Retry failed", err);
                setError(true);
              } finally {
                setLoading(false);
              }
            })();
          }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Heading size="lg" mb={6}>
        Market Highlights
      </Heading>

      <TableContainer overflowX="auto">
        <Table variant="striped" colorScheme="gray" size="sm">
          <Thead>
            <Tr>
              <Th position="sticky" left={0} bg={stickyBg} zIndex={1}>
                Coin
              </Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>1h %</Th>
              <Th isNumeric>24h %</Th>
              <Th isNumeric>7d %</Th>
              <Th isNumeric>30d %</Th>
              <Th isNumeric>1y %</Th>
              <Th isNumeric>Market Cap</Th>
              <Th isNumeric>Volume (24h)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coins.map((coin) => (
              <Tr key={coin.id}>
                <Td
                  position="sticky"
                  left={0}
                  bg={stickyBg}
                  zIndex={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Link
                    as={RouterLink}
                    to={`/coin/${coin.id}`}
                    _hover={{ textDecoration: "underline", color: "blue.400" }}
                  >
                    <Box display="flex" alignItems="center" gap={3}>
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        boxSize="24px"
                        borderRadius="full"
                      />
                      <Text fontWeight="bold">
                        <Text as="span">{coin.symbol.toUpperCase()}</Text>
                      </Text>
                    </Box>
                  </Link>
                </Td>
                <Td isNumeric>{formatCurrency(coin.price)}</Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_1h >= 0 ? "green.500" : "red.500"
                  }
                >
                  {formatPercent(coin.price_change_percentage_1h)}
                </Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_24h >= 0
                      ? "green.500"
                      : "red.500"
                  }
                >
                  {formatPercent(coin.price_change_percentage_24h)}
                </Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_7d >= 0 ? "green.500" : "red.500"
                  }
                >
                  {formatPercent(coin.price_change_percentage_7d)}
                </Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_30d >= 0
                      ? "green.500"
                      : "red.500"
                  }
                >
                  {formatPercent(coin.price_change_percentage_30d)}
                </Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_1y >= 0 ? "green.500" : "red.500"
                  }
                >
                  {formatPercent(coin.price_change_percentage_1y)}
                </Td>
                <Td isNumeric>{formatCurrency(coin.market_cap)}</Td>
                <Td isNumeric>{formatCurrency(coin.volume_24h)}</Td>
              </Tr>
            ))} 
          </Tbody>
        </Table>
      </TableContainer>

      {/* 🔹 Pagination Controls */}
      <HStack justify="center" mt={6} spacing={4}>
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          isDisabled={page === 1}
        >
          Prev
        </Button>
        <Text>Page {page}</Text>
        <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
      </HStack>
    </Container>
  );
}
