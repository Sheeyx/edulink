// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    isNewUser?: boolean;
    googleId?: string;
    role?: "STUDENT" | "TEACHER" | "ADMIN";
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isNewUser?: boolean;
      googleId?: string;
      role?: "STUDENT" | "TEACHER" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isNewUser?: boolean;
    googleId?: string;
    role?: "STUDENT" | "TEACHER" | "ADMIN";
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional: force consent for reliable refresh
      // authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
  ],

  // We use a custom page to orchestrate sign-in & onboarding
  pages: {
    signIn: "/auth/register",
    // You can also define error/verifyRequest if you want
  },

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Runs during OAuth login.
     * - Calls your GraphQL `checkSocialIdExists`
     * - If exists, fetches user profile to capture role
     * - If not exists, mark as new
     */
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" && profile?.sub) {
        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:3003";

          // 1) check existence
          const res = await fetch(`${backendUrl}/graphql`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query CheckSocialIdExists($input: CheckSocialUserInput!) {
                  checkSocialIdExists(input: $input) {
                    exists
                  }
                }
              `,
              variables: {
                input: {
                  memberGoogleId: profile.sub,
                  memberAuth: "GOOGLE",
                },
              },
            }),
          });

          if (!res.ok) return false;
          const json = await res.json();
          const exists = json?.data?.checkSocialIdExists?.exists as boolean;

          user.isNewUser = !exists;
          user.googleId = profile.sub;

          // 2) If exists, fetch profile to set role
          if (exists) {
            const res2 = await fetch(`${backendUrl}/graphql`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                query: `
                  query GetMeByGoogle($googleId: String!) {
                    memberByGoogleId(googleId: $googleId) {
                      id
                      role        # <-- should be STUDENT | TEACHER | ADMIN
                      name
                      email
                      avatarUrl
                    }
                  }
                `,
                variables: { googleId: profile.sub },
              }),
            });

            if (res2.ok) {
              const json2 = await res2.json();
              const me = json2?.data?.memberByGoogleId;
              if (me?.role) user.role = me.role;
              // You can also set user.name/email from backend if you prefer backend truth
            }
          }
        } catch (err) {
          console.error("signIn error:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.isNewUser = user.isNewUser;
        token.googleId = user.googleId;
        if (user.role) token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.isNewUser = token.isNewUser;
        session.user.googleId = token.googleId;
        session.user.role = token.role;
      }
      return session;
    },

    /**
     * Centralize redirects:
     * - Always go to /auth/register after OAuth to orchestrate flow
     * - From that page, you redirect the user based on isNewUser/role
     */
    async redirect({ baseUrl }) {
      return `${baseUrl}/auth/register`;
    },
  },
});

export { handler as GET, handler as POST };
