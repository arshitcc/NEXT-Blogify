import { connectDB } from "@/lib/db";
import { Blog, IBlog } from "@/models/blogs.models";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  // get Post
  try {
    await connectDB();
    const { userId, blogId } = await context.params;
    if (!isValidObjectId(userId) || !isValidObjectId(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid User or Blog ID", data: {} },
        { status: 400 }
      );
    }

    const blog = await Blog.findOne({ _id: blogId, postedBy: userId });

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found", data: {} },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog found", data: blog },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: NextRequest, context: any) => {
  // update Post
  try {
    await connectDB();
    const { userId, blogId } = await context.params;
    if (!isValidObjectId(userId) || !isValidObjectId(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid User or Blog ID", data: {} },
        { status: 400 }
      );
    }

    const { title, body, thumbnail }: IBlog = await req.json();
    if ([title, body, thumbnail].some((field) => !field?.trim())) {
      return NextResponse.json(
        { success: false, message: "All fields are required", data: {} },
        { status: 400 }
      );
    }

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId, postedBy: userId },
      {
        $set : {title, body, thumbnail}
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized  or Blog not found",
          data: {},
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog updated", data: blog },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, context: any) => {
  // delete Post
  try {
    await connectDB();
    const { userId, blogId } = await context.params;
    if (!isValidObjectId(userId) || !isValidObjectId(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid User or Blog ID", data: {} },
        { status: 400 }
      );
    }

    const blog = await Blog.findOneAndDelete({ _id: blogId, postedBy: userId });

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized  or Blog not found",
          data: {},
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog deleted", data: {} },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    );
  }
};
