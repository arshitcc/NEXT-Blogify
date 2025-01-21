import { signupSchema } from "@/schemas/signup.schema";
import { loginSchema } from "@/schemas/login.schema";
import { z } from "zod";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role?: string;
  isVerified: boolean;
  verificationCode?: string;
  verificationCodeExpiry?: Date;
  avatar: string;
}

export enum loginMethod {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials",
}

export interface IUserState {
  user: IUser | null;
  profile: any;
  isLoading: boolean;
  error: string;
  signup: (data: Omit<z.infer<typeof signupSchema>,'confirmPassword'>) => Promise<boolean>;
  login: (method: loginMethod, data?: z.infer<typeof loginSchema>) => Promise<boolean>;
  logout: () => Promise<boolean>;
  getProfile: (userId: string) => Promise<boolean>;
}
