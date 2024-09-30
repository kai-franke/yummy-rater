import Header from "./Header";
import Navigation from "./Navigation";
import { ReactNode } from "react";
import { Box } from "@mui/material";
interface AuthProps {
  children: ReactNode;
}

export default function Layout({ children }: AuthProps) {
  return (
    <>
      <Header />
      <Box component="main" m={3}>
        {children}
      </Box>
      <Navigation />
    </>
  );
}
