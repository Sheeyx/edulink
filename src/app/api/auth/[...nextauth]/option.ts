import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,   // 👈 make sure env vars match your .env.local
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/login", // keep your login page
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // Save the Google "sub" (unique Google ID)
      if (account?.provider === "google" && profile?.sub) {
        token.sub = profile.sub;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose Google ID to the client session
      if (token?.sub) {
        (session.user as any).sub = token.sub;
        (session.user as any).id = token.sub; // optional alias
      }
      return session;
    },
  },
};
