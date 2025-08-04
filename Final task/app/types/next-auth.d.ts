import "next-auth";
import { DefaultSession } from "next-auth";

// Augment the default `Session` interface from `next-auth`
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      id?: string;
    } & DefaultSession["user"];
  }

  // Augment the default `User` interface
  interface User {
    id: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

// Augment the default `JWT` interface from `next-auth/jwt`
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
