import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Image,
    Card,
    CardBody,
  } from "@chakra-ui/react";
import CryptoTable from "../components/cryptoTable";
import StatsCards from "../components/StatsCards";
import CryptoSearch from "../components/cryptoSearch";
import CoinsHighLight from "../components/coinHighLightCards"; 
  
  const newsData = [
    {
      title: "Bitcoin hits new all-time high",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Ethereum upgrade boosts network speed",
      image: "https://via.placeholder.com/150",
    },
    {
      title: "Institutional investors eye crypto ETFs",
      image: "https://via.placeholder.com/150",
    },
  ];
  
  export default function Landing() {
    return (
      <Box>
        <StatsCards />
        <CoinsHighLight />

        <Box py={16}>
        <CryptoSearch />
        <Box mt={12}>  
          <CryptoTable />
        </Box>
      </Box>
        {/* ---------------- LATEST NEWS ---------------- */}
        <Box bg="gray.50" py={16}>
          <Container maxW="container.lg">
            <Heading size="lg" mb={6}>
              Latest News
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {newsData.map((news, i) => (
                <Card key={i} shadow="md" borderRadius="xl" overflow="hidden">
                  <Image src={news.image} alt={news.title} />
                  <CardBody>
                    <Text fontWeight="bold">{news.title}</Text>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Box>
    );
  }
  