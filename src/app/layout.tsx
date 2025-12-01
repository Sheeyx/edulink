// src/app/layout.tsx
import "./globals.css";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/providers/auth-context";
import AppShell from "@/components/AppShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="min-h-screen flex flex-col">
        <SessionProviderWrapper>
          <ReactQueryProvider>
            <AuthProvider>
              <AppShell>{children}</AppShell>
            </AuthProvider>
          </ReactQueryProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
