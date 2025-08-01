import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      googleId: unknown;
      isNewUser: unknown;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
  }
}
