import { z } from "zod";

export const commentSchema = z.object({
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters long")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type Comment = z.infer<typeof commentSchema>