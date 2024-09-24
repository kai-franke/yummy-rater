import Header from "./Header";
import Navigation from "./Navigation";
import { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

export default function Layout({ children }: AuthProps) {
  return (
    <>
      <Header />
      {children}
      <Navigation />
    </>
  );
}
