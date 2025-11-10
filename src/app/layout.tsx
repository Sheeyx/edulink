// src/app/layout.tsx
import "./globals.css";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/providers/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <SessionProviderWrapper>
          <ReactQueryProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </AuthProvider>
          </ReactQueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
