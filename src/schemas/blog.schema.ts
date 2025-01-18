import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters long")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be URL-friendly, containing only lowercase letters, numbers, and hyphens"
    )
    .min(3, "Slug must be at least 3 characters long")
    .max(50, "Slug cannot exceed 50 characters"),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  body: z
    .string()
    .min(20, "Body content must be at least 20 characters long")
    .max(10000, "Body content cannot exceed 10,000 characters"),
});

export type Blog = z.infer<typeof blogSchema>
