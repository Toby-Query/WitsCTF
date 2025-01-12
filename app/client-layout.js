"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import React from "react";
import { SearchProvider } from "../context/SearchContext";
import { DrawerProvider } from "../context/DrawerContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage ? (
        <SearchProvider>
          <DrawerProvider>
            <Navbar />
            {children}
          </DrawerProvider>
        </SearchProvider>
      ) : (
        children // Render children as-is for login page
      )}
    </>
  );
}
