import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  useColorModeValue,
  Link
} from "@chakra-ui/react";
import { formatPercent } from "../utils/format";
import { getTopGainers, getTopLosers, getTrending } from "../services/coinGekoAPI";

export default function SeeMorePage() {
  const { category } = useParams(); // "gainers" | "losers" | "trending"
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (category === "gainers") {
          setCoins(await getTopGainers());
        } else if (category === "losers") {
          setCoins(await getTopLosers());
        } else if (category === "trending") {
          setCoins(await getTrending());
        }
      } catch (err) {
        console.error("Error fetching:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const stickyBg = useColorModeValue("white", "gray.800");

  return (
    <Box p={6}>
      <Heading mb={6} fontSize="2xl" textAlign="center">
        {category === "gainers" && "🚀 Top Gainers"}
        {category === "losers" && "📉 Top Losers"}
        {category === "trending" && "🔥 Trending Coins"}
      </Heading>

      {loading ? (
        <Spinner size="xl" display="block" mx="auto" />
      ) : coins.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="gray" size="md">
            <Thead>
              <Tr>
                <Th
                  position="sticky"
                  left={0}
                  bg={stickyBg}   
                  zIndex={1}
                >
                  Coin
                </Th>
                <Th isNumberic>Price</Th>
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
              {coins.map((coin, index) => (
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
                    <Image src={coin.image} alt={coin.name} boxSize="24px" />
                    {coin.name} ({coin.symbol.toUpperCase()})
                    </Link>
                    </Td>
                  
                  <Td>${coin.price?.toLocaleString()}</Td>
                  <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_1h >= 0
                      ? "green.500"
                      : "red.500"
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
                    coin.price_change_percentage_7d >= 0
                      ? "green.500"
                      : "red.500"
                  }
                >
                  {formatPercent(coin.price_change_percentage_7d) }
                </Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_30d >= 0
                      ? "green.500"
                      : "red.500"
                  }
                >
                  {coin.price_change_percentage_30d ? formatPercent(coin.price_change_percentage_30d) : "-"}
                </Td>
                <Td
                  isNumeric
                  color={
                    coin.price_change_percentage_1y >= 0
                      ? "green.500"
                      : "red.500"
                  }
                >
                  {coin.price_change_percentage_1y ? formatPercent(coin.price_change_percentage_1y) : "-"}
                </Td>
                  <Td>${coin.market_cap?.toLocaleString()}</Td>
                  <Td>${coin.volume_24h?.toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Text textAlign="center">No data found</Text>
      )}
    </Box>
  );
  
}
