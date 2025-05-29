// types/next-auth.d.ts or inside your global types folder

import { DefaultSession, DefaultUser } from "next-auth"; // ✅ Required for base types

declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      isVerified: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
