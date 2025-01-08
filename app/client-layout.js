"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Drawer from "@/components/Drawer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      {children}
      <Drawer />
    </>
  );
}
