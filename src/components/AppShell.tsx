// src/components/AppShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/dashboard");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}
