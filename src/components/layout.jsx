// src/components/Layout.jsx
import {Outlet } from "react-router-dom";
import Footer from "./footer";
import { Box } from "@chakra-ui/react";
import Navbar from "./navBar";

export default function Layout() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />

      <Box flex="1" p={4}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}
