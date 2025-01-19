import { Blog } from "@/models/blogs.models";
import { connectDB } from "@/lib/db";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  // get blog
  try {
    await connectDB();
    const { blogId } = await context.params;
    if (!isValidObjectId(blogId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Blog ID", data: {} },
        { status: 400 }
      );
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { $set: { views: { $inc: 1 } } },
      { new: true }
    );

    if(!updatedBlog){
      return NextResponse.json(
        { success: false, message: "Blog not found", data: {} },
        { status: 404 }
      );
    }

    const blog = await Blog.aggregate([
      {
        $match: {
          _id: blogId,
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "blogId",
          as: "comments",
        },
      },
      {
        $addFields: {
          size: {
            $size: "$comments",
          },
          comments: {
            $first: "$comments",
          },
        },
      },
    ]);

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