// app/layout.tsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <SessionProviderWrapper>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
