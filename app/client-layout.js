"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import React from "react";
import { SearchProvider } from "./context/SearchContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage ? (
        <SearchProvider>
          <Navbar />
          {children}
        </SearchProvider>
      ) : (
        children // Render children as-is for login page
      )}
    </>
  );
}
