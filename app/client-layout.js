"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import React from "react";
import { SearchProvider } from "./context/SearchContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // const [searchQuery, setSearchQuery] = useState(""); // Manage search query here

  // Create a childrenWithProps object that includes the search props
  // const childrenWithProps = React.Children.map(children, (child) => {
  //   // Only add props if child exists
  //   if (React.isValidElement(child)) {
  //     console.log(
  //       "child",
  //       React.cloneElement(child, { searchQuery, setSearchQuery })
  //     );
  //     return React.cloneElement(child, { searchQuery, setSearchQuery });
  //   }
  //   return child;
  // });

  // console.log("searchQuery", searchQuery);

  return (
    <>
      {!isLoginPage ? (
        <SearchProvider>
          <Navbar />
          {children}
        </SearchProvider>
      ) : (
        { children } // Render children as-is for login page
      )}
    </>
  );
}
