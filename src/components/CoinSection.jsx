import { Box, Flex, Text, Link, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export default function CoinSection({ title, coins, seeMoreLink }) {
  return (
    <Box p={4} shadow="sm" borderWidth="1px" rounded="md">
      {/* Section Title */}
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Link as={RouterLink} to={seeMoreLink} color="blue.500" fontSize="sm">
          See More
        </Link>
      </Flex>

      {/* Show only 3 coins */}
      <Flex direction="column" gap={2}>
        {coins.slice(0, 3).map((coin) => {
          const isPositive = coin.price_change_percentage_24h >= 0;

          return (
           
            <Flex
              key={coin.id}
              justify="space-between"
              align="center"
              p={2}
              borderWidth="1px"
              rounded="md"
            >
               <Link
                  as={RouterLink}
                  to={`/coin/${coin.id}`} 
                  _hover={{ textDecoration: "underline", color: "blue.400" }}
                >
              <Flex align="center" gap={2}>
                <Image
                  src={coin.image}
                  alt={coin.name}
                  boxSize="20px"
                  borderRadius="full"
                />
                <Text fontSize="sm" fontWeight="bold">
                  {coin.symbol.toUpperCase()}
                </Text>
              </Flex>
              </Link>
              <Text
                fontSize="sm"
                color={isPositive ? "green.500" : "red.500"}
                fontWeight="semibold"
              >
                {isPositive ? "+" : ""}
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}
