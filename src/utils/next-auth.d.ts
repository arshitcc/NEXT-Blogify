import "next-auth";
import { UserRoles } from "@/models/users.model";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    role?: UserRoles;
  }
  interface Session {
    user?: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
    interface JWT extends Record<string, unknown>, User {}
}
