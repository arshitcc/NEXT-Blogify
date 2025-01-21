import { blogSchema } from "@/schemas/blog.schema";
import { z } from "zod";

export interface IBlog {
  _id: string;
  thumbnail: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  postedBy: string;
  isActive: boolean;
  comments: IComment[];
  size: number;
}

export interface IComment {
  _id: string;
  blogId: string;
  userId: string;
  comment: string;
}

export interface ICommentState {
  isLoading: boolean;
  error: string;
  addComment: (comment: Omit<IComment,'_id'>) => Promise<boolean>;
  removeComment: (comment: IComment) => Promise<boolean>;
}

export interface IBlogState {
  blog: IBlog | null;
  isLoading: boolean;
  error: string;
  blogs: IBlog[];

  getBlog : (blogId: string, userId : string) => Promise<boolean>;
  createBlog : (blogData: Partial<z.infer<typeof blogSchema>>, userId : string) => Promise<boolean>;
  updateBlog : (blog: Partial<IBlog>, userId : string) => Promise<boolean>;
  deleteBlog : (blogId: string, userId: string) => Promise<boolean>;
}

