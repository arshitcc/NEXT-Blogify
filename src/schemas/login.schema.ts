import { z } from "zod";

export const loginSchema = z.object({
  user: z.string().min(3, "Enter valid username or email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
}); 