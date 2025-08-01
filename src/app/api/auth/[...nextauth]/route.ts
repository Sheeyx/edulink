import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    isNewUser?: boolean;
    googleId?: string;
  }
  
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isNewUser?: boolean;
      googleId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isNewUser?: boolean;
    googleId?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/register",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ Runs when user signs in
    async signIn({ account, profile, user }) {
      if (account?.provider === "google" && profile?.sub) {
        try {
          const backendUrl = process.env.BACKEND_URL || "http://localhost:3003";
          console.log("Checking Google user existence...");
          
          const res = await fetch(`${backendUrl}/graphql`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
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

          if (!res.ok) {
            console.error("❌ Backend returned status:", res.status);
            return false;
          }

          const json = await res.json();
          const exists = json?.data?.checkSocialIdExists?.exists;

          console.log("User exists:", exists);

          // ✅ Attach custom props to user object
          user.isNewUser = !exists;
          user.googleId = profile.sub;
          
        } catch (err) {
          console.error("❌ Error in signIn callback:", err);
          return false;
        }
      }

      return true;
    },

    // ✅ Save to token for client and server access
    async jwt({ token, user }) {
      if (user) {
        token.isNewUser = user.isNewUser;
        token.googleId = user.googleId;
      }
      return token;
    },

    // ✅ Add to session to use in frontend
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.isNewUser = token.isNewUser;
        session.user.googleId = token.googleId;
      }
      return session;
    },

    // ✅ Custom redirect logic
    async redirect({ url, baseUrl }) {
      // Always redirect back to the register page to handle the flow
      return `${baseUrl}/auth/register`;
    },
  },
});

export { handler as GET, handler as POST };