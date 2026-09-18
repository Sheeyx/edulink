import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, account, profile }) {
      // keep Google unique id (sub) on the JWT
      if (account?.provider === "google" && profile?.sub) {
        token.sub = profile.sub;
      }
      return token;
    },
    async session({ session, token }) {
      // expose sub to client session (session.user.sub / id)
      if (token?.sub) {
        const user = session.user as typeof session.user & { sub?: string; id?: string };
        user.sub = token.sub;
        user.id = token.sub; // optional alias
      }
      return session;
    },
  },
};
