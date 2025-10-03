// src/components/News.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Button,
  SimpleGrid,
  Spinner,
  Flex,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // pagination state
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  // fetch function
  const fetchNews = async (url, pageOverride = null) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      console.log("🔎 API Response in React:", data);

      if (!Array.isArray(data.results)) {
        throw new Error("No news data returned.");
      }

      setNews(data.results);
      setNextPage(data.next || null);
      setPrevPage(data.previous || null);
      setCount(data.count || 0);

      if (pageOverride) setCurrentPage(pageOverride);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch (page 1)
  useEffect(() => {
    fetchNews("/.netlify/functions/fetchNews?page=1&size=6", 1);
  }, []);

  // handle pagination click
  const handlePageChange = (pageObj, pageNum) => {
    if (pageObj) {
      const { page, size } = pageObj;
      fetchNews(`/.netlify/functions/fetchNews?page=${page}&size=${size}`, parseInt(page));
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6} textAlign="center" color="gray.800">
        Latest Crypto News
      </Heading>

      {loading && (
        <Flex justify="center" align="center" minH="100px">
          <Spinner size="lg" />
        </Flex>
      )}

      {error && (
        <Text color="red.500" fontWeight="bold" textAlign="center">
          Error: {error}
        </Text>
      )}

      {!loading && !error && (
        <>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {news.map((article, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="lg"
                shadow="md"
                bg={cardBg}
              >
                {/* Thumbnail image */}
                {article.thumbnail && (
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    borderRadius="md"
                    mb={3}
                    w="100%"
                    h="150px"
                    objectFit="cover"
                  />
                )}

                <Heading size="md" mb={2} noOfLines={2}>
                  {article.title}
                </Heading>
                <Text fontSize="sm" color="gray.600" noOfLines={3} mb={3}>
                  {article.description || "No description available."}
                </Text>
                <Link
                  href={article.url}
                  isExternal
                  color="blue.500"
                  fontWeight="semibold"
                >
                  Read more
                </Link>
              </Box>
            ))}
          </SimpleGrid>

          {/* Pagination */}
          <Flex justify="space-between" align="center" mt={8}>
            <Button
              colorScheme="blue"
              onClick={() => handlePageChange(prevPage, currentPage - 1)}
              isDisabled={!prevPage}
            >
              Previous
            </Button>
            <Text fontWeight="small" color="gray.800">
              Page {currentPage} {count ? `of ~${Math.ceil(count / 6)}` : ""}
            </Text>
            <Button
              colorScheme="blue"
              onClick={() => handlePageChange(nextPage, currentPage + 1)}
              isDisabled={!nextPage}
            >
              Next
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default News;
