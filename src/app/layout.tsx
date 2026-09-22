// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/providers/auth-context";
import { CartProvider } from "@/providers/cart-context";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Hubee",
  description:
    "Hubee — live tutoring and structured online courses for learning English and Korean, anywhere, anytime.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
