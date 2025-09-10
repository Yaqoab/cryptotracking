// src/components/StatsCards.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Flex,
  Icon,
  Button,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { getGlobalStats } from "../services/coinGekoAPI";
import { FaChartLine, FaCoins, FaFire, FaMoneyBillWave } from "react-icons/fa";
import Loader from "./loader";
import { formatCurrency } from "../utils/format";

export default function StatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async (forceRefresh = false) => {
    setLoading(true);
    setError(false);

    try {
      const data = await getGlobalStats(forceRefresh);
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(); // normal load → uses cache if available
  }, []);

  if (loading) return <Loader />;

  if (error || !stats) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Text fontSize="lg" color="red.400" mb={4}>
          Failed to load global stats. Please try again.
        </Text>
        <Button colorScheme="teal" onClick={() => fetchStats(true)}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Heading size="lg" mb={6}>
        Global Market Stats
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          title="Total Market Cap"
          value={
            stats.total_market_cap?.usd
              ? formatCurrency(stats.total_market_cap.usd)
              : null
          }
          icon={FaCoins}
          color="teal.500"
        />
        <StatCard
          title="24h Volume"
          value={
            stats.total_volume?.usd
              ? formatCurrency(stats.total_volume.usd)
              : null
          }
          icon={FaMoneyBillWave}
          color="blue.500"
        />
        <StatCard
          title="BTC Dominance"
          value={
            stats.market_cap_percentage?.btc
              ? `${stats.market_cap_percentage.btc.toFixed(2)}%`
              : null
          }
          icon={FaChartLine}
          color="orange.400"
        />
        <StatCard
          title="Active Cryptos"
          value={
            stats.active_cryptocurrencies
              ? stats.active_cryptocurrencies.toLocaleString()
              : null
          }
          icon={FaFire}
          color="red.400"
        />
      </SimpleGrid>
    </Container>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Box
      p={6}
      rounded="2xl"
      borderWidth="1px"
      bg="white"
      _dark={{ bg: "gray.800" }}
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
    >
      <Stat>
        <Flex align="center" mb={2}>
          <Icon as={icon} w={6} h={6} color={color} mr={2} />
          <StatLabel
            fontWeight="medium"
            color="gray.600"
            _dark={{ color: "gray.300" }}
          >
            {title}
          </StatLabel>
        </Flex>
        <StatNumber fontSize="2xl" fontWeight="bold">
          {value !== null && value !== undefined ? (
            value
          ) : (
            <Spinner size="sm" thickness="3px" />
          )}
        </StatNumber>
        <StatHelpText>
          <StatArrow type="increase" /> Updated Now
        </StatHelpText>
      </Stat>
    </Box>
  );
}
