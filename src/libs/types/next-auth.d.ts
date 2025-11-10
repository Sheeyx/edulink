// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    isNewUser?: boolean;
    googleId?: string;
    role?: "STUDENT" | "MENTOR" | "ADMIN";
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isNewUser?: boolean;
      googleId?: string;
      role?: "STUDENT" | "MENTOR" | "ADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isNewUser?: boolean;
    googleId?: string;
    role?: "STUDENT" | "MENTOR" | "ADMIN";
  }
}

export {};
