import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProviders from "next-auth/providers/google";
import GithubProviders from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import { User } from "@/models/users.model";
import { User as NextUser } from "next-auth";
import bcrypt from "bcrypt";

export const AuthOptions: NextAuthOptions = {
  providers: [
    GoogleProviders({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProviders({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        user: {
          label: "Email or username",
          type: "text",
          placeholder: "Email or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials: Record<"user" | "password", string> | undefined) : Promise<NextUser | null>{
        await connectDB();

        try {
          const user = await User.findOne({
            $or: [{ email: credentials?.user }, { username: credentials?.user }],
          });
          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password || "",
            user.password
          );
          if (isPasswordCorrect) {
            return user as unknown as NextUser;
          } else {
            throw new Error("Wrong Password");
          }
        } catch (error : unknown) {
            throw new Error((error as { message: string })?.message || "");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        if(user){
            token._id = user._id; 
            token.username = user.username;
            token.isVerified = user.isVerified;
            token.role = user.role;
        }
        return token;
    },
    async session({ session, token }) {
        if(token){
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
            session.user.role = token.role;
        }
        return session;
    },
    async signIn({ account, profile, user }) {
      await connectDB();
      if (account?.provider === "google" || account?.provider === "github") {
        const user = await User.findOne({ email: profile?.email });
        if (user) {
          user.isVerified = true;
          await user.save();
          return true;
        } 
        else {
          await User.create({
            username: profile?.name || (profile as { login: string })?.login ||profile?.email?.split("@")[0],
            email: profile?.email,
            password : account.provider,
            isVerified: true,
            avatar : (profile as { picture: string })?.picture || (profile as { avatar_url: string })?.avatar_url || "",
            verificationCode : Math.floor(100000 + Math.random() * 900000).toString(),
            verificationCodeExpiry : new Date(Date.now() + 15 * 60 * 1000)
          });
          return true;
        }
      }
      if(account?.provider === "credentials" && user){
        return true;
      }
      return false;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(AuthOptions);
