import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Button,
  Flex,
  Spinner,
  Heading,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/.netlify/functions/fetchNews");
      const data = await res.json();

      setNews(data.data?.results || []);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <Box p={4}>
      <Heading size="lg" mb={6} textAlign="center" color={"gray.800"}>
        Crypto News
      </Heading>

      {loading && (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      )}

      {!loading && news.length === 0 && (
        <Text textAlign="center">No news found.</Text>
      )}

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {news.map((item, idx) => (
          <Box
            key={idx}
            borderWidth="1px"
            borderColor={cardBorder}
            bg={cardBg}
            rounded="lg"
            p={4}
            shadow="md"
          >
            {item.thumbnail && (
              <Image src={item.thumbnail} alt={item.title} mb={2} rounded="md" />
            )}
            <Text fontSize="xl" fontWeight="bold" mb={1}>
              {item.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {new Date(item.published_at).toLocaleString()} •{" "}
              {item.source?.name || "Unknown"}
            </Text>
            <Text noOfLines={2} mt={2}>
              {item.description}
            </Text>
            <Button
              as="a"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              mt={3}
              colorScheme="blue"
            >
              Read More
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default News;
