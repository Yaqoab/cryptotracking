// src/pages/Home.jsx
import { SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getTopGainers, getTopLosers, getTrending } from "../services/coinGekoAPI";
import CoinSection from "./CoinSection";

export default function Home() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setGainers(await getTopGainers());
      setLosers(await getTopLosers());
      setTrending(await getTrending());
    };
    fetchData();
  }, []);

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      <CoinSection title="🚀 Top Gainers" coins={gainers} seeMoreLink="/see-more/gainers" />
      <CoinSection title="📉 Top Losers" coins={losers} seeMoreLink="/see-more/losers" />
      <CoinSection title="🔥 Trending" coins={trending} seeMoreLink="/see-more/trending" />
    </SimpleGrid>
  );
}
