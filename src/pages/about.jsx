import React from "react";
import { Box, Heading, Text, VStack, useColorModeValue } from "@chakra-ui/react";

const About = () => {
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box p={6} maxW="800px" mx="auto">
      <Heading mb={4} textAlign="center">
        About This App
      </Heading>
      <VStack spacing={4} align="start">
        <Text color={textColor}>
          🚀 Welcome to <strong>Crypto Tracker</strong> – a simple web app that
          helps you stay updated with the latest cryptocurrency prices, trends,
          and news.
        </Text>

        <Text color={textColor}>
          📊 The app fetches real-time data from trusted APIs like{" "}
          <strong>CoinGecko</strong> and <strong>ThenewsApi</strong>, so you can
          monitor your favorite coins without needing to log in.
        </Text>

        <Text color={textColor}>
          📰 In addition to prices, you’ll also find the latest{" "}
          <strong>crypto-related news</strong> from around the world, making it
          easier to stay informed about market moves.
        </Text>

        <Text color={textColor}>
          ⚡ Built with <strong>React</strong> and <strong>Chakra UI</strong>,
          this project is designed to be fast, lightweight, and mobile-friendly.
        </Text>

        <Text color={textColor}>
          🙌 This is a personal project to practice building frontend apps,
          integrate APIs, and showcase development skills.
        </Text>

        <Text color={textColor} fontStyle="italic">
          Note: This app is for educational and informational purposes only. It
          is <strong>not financial advice</strong>. Always do your own research
          before investing.
        </Text>
      </VStack>
    </Box>
  );
};

export default About;
