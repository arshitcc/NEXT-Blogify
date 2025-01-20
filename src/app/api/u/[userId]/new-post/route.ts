import { Blog, IBlog } from "@/models/blogs.models";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

export const POST = async (req: NextRequest, context: any) => {
  try {
    await connectDB();

    const { userId } = await context.params;

    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid User ID", data: {} },
        { status: 400 }
      );
    }

    const { title, body }: IBlog = await req.json();
    if ([title, body].some((field) => !field?.trim())) {
      return NextResponse.json(
        { success: false, message: "All fields are required", data: {} },
        { status: 400 }
      );
    }
    const slug = title.trim().split(" ").join("-").toLowerCase();
    const blog = await Blog.create({
      title,
      slug,
      body,
      postedBy: userId,
    });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Failed to create post", data: {} },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Post created successfully", data: blog },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create post",
      },
      { status: 500 }
    );
  }
};
