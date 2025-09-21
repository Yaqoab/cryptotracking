// src/components/details.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Image,
  Spinner,
  useColorModeValue,
  Link,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import { FaTwitter, FaFacebook, FaReddit } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getCoinById, getCoinMarketChart } from "../services/coinGekoAPI";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Details = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Hooks at the top
  const chartColor = useColorModeValue("#1A202C", "#CBD5E0");
  const gridColor = useColorModeValue("#E2E8F0", "#2D3748");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const descriptionColor = useColorModeValue("gray.700", "gray.300");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCoinById(id);
        setCoin(data);
        
        const chartData = await getCoinMarketChart(id, "usd", 7);
        setChart(chartData.prices || []);
      } catch (error) {
        console.error("Error fetching coin details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );

  if (!coin)
    return (
      <Flex justify="center" align="center" h="100vh">
        <Text>Coin not found</Text>
      </Flex>
    );

  // Chart data with current price highlighted
  const chartData = {
    labels: chart.map((c) => new Date(c[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${coin.name} Price (USD)`,
        data: chart.map((c) => c[1]),
        borderColor: chartColor,
        backgroundColor: "transparent",
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColor,
      },
      // Highlight current price as a red point
      {
        label: "Current Price",
        data: chart.map((c, i) => (i === chart.length - 1 ? c[1] : null)),
        borderColor: "transparent",
        backgroundColor: "red",
        pointRadius: 6,
        pointHoverRadius: 6,
        showLine: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, labels: { color: chartColor } },
      tooltip: {
        callbacks: {
          label: (context) =>
            `$${context.raw?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
        },
      },
    },
    scales: {
      x: { ticks: { color: chartColor }, grid: { display: false } },
      y: {
        ticks: {
          color: chartColor,
          callback: (value) => `$${value.toLocaleString()}`,
        },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <Box p={{ base: 4, md: 6 }} maxW="900px" mx="auto">
      {/* Header */}
      <Flex align="center" mb={6} gap={4}>
        <Image src={coin.image?.large} alt={coin.name} boxSize="60px" />
        <VStack align="start" spacing={0}>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
            {coin.name}
          </Text>
          <Text fontSize="md" color="gray.500">
            {coin.symbol?.toUpperCase() ?? "N/A"}
          </Text>
        </VStack>
      </Flex>

      {/* Chart */}
      <Box mb={6} borderRadius="md" p={4} boxShadow="md" bg={bgColor}>
        <Line data={chartData} options={chartOptions} />
      </Box>

      {/* Price + Market Data */}
      <Flex wrap="wrap" gap={6} mb={6}>
        <Box>
          <Text fontWeight="bold">Current Price:</Text>
          <Text>${coin.market_data?.current_price?.usd?.toLocaleString() ?? "N/A"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Market Cap:</Text>
          <Text>${coin.market_data?.market_cap?.usd?.toLocaleString() ?? "N/A"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Total Supply:</Text>
          <Text>{coin.market_data?.total_supply?.toLocaleString() ?? "N/A"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Circulating Supply:</Text>
          <Text>{coin.market_data?.circulating_supply?.toLocaleString() ?? "N/A"}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">All Time High:</Text>
          <Text>
            ${coin.market_data?.ath?.usd?.toLocaleString() ?? "N/A"} on{" "}
            {coin.market_data?.ath_date?.usd
              ? new Date(coin.market_data.ath_date.usd).toLocaleDateString()
              : "N/A"}
          </Text>
        </Box>
      </Flex>

       {/* About / Description */}
       {coin.description?.en && (
        <Box mb={6}>
          <Text fontSize="lg" mb={2} fontWeight="bold">
            About
          </Text>
          <Text
            fontSize="md"
            color={descriptionColor}
            dangerouslySetInnerHTML={{ __html: coin.description.en }}
          />
        </Box>
      )}

      {/* Social Media Links */}
      <Box mt={4}>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Social Media
        </Text>
        <HStack spacing={4} wrap="wrap">
          {coin.links?.homepage?.[0] && (
            <Link href={coin.links.homepage[0]} isExternal fontWeight="semibold" color="blue.500">
              Website
            </Link>
          )}
          {coin.links?.twitter_screen_name && (
            <Link
              href={`https://twitter.com/${coin.links.twitter_screen_name}`}
              isExternal
              display="flex"
              alignItems="center"
              fontWeight="semibold"
              color="#1DA1F2"
            >
              <Icon as={FaTwitter} mr={1} /> Twitter
            </Link>
          )}
          {coin.links?.facebook_username && (
            <Link
              href={`https://facebook.com/${coin.links.facebook_username}`}
              isExternal
              display="flex"
              alignItems="center"
              fontWeight="semibold"
              color="#1877F2"
            >
              <Icon as={FaFacebook} mr={1} /> Facebook
            </Link>
          )}
          {coin.links?.subreddit_url && (
            <Link
              href={coin.links.subreddit_url}
              isExternal
              display="flex"
              alignItems="center"
              fontWeight="semibold"
              color="#FF4500"
            >
              <Icon as={FaReddit} mr={1} /> Reddit
            </Link>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default Details;
