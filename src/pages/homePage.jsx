import {
    Box,
    Container,
  } from "@chakra-ui/react";
import CryptoTable from "../components/cryptoTable";
import StatsCards from "../components/StatsCards";
import CryptoSearch from "../components/cryptoSearch";
import CoinsHighLight from "../components/coinHighLightCards"; 
import News from "../components/news";
  
  
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
            <News />
          </Container>
        </Box>
      </Box>
    );
  }
  