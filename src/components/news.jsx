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
  SimpleGrid, // ✅ for grid layout
} from "@chakra-ui/react";

const News = () => {
  const [news, setNews] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  const fetchNews = async (url) => {
    try {
      setLoading(true);
      const res = await fetch(url.replace("http://", "https://"));
      const data = await res.json();

      setNews(data.data?.results || []);
      setNextPage(data.data?.next);
      setPrevPage(data.data?.previous);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(
      `https://api.thenewsapi.net/crypto?apikey=${process.env.REACT_APP_NEWS_API_KEY}&page=1&size=10`
    );
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

      {!loading && news.length === 0 && <Text textAlign="center">No news found.</Text>}

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

      {/* Pagination controls */}
      <Flex justify="center" gap={4} mt={6}>
        <Button
          onClick={() => prevPage && fetchNews(prevPage)}
          isDisabled={!prevPage}
          colorScheme="teal"
        >
          Previous
        </Button>
        <Button
          onClick={() => nextPage && fetchNews(nextPage)}
          isDisabled={!nextPage}
          colorScheme="teal"
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default News;
