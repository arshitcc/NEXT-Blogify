import { Blog } from "@/models/blogs.models";
import { connectDB } from "@/lib/db";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { AuthOptions } from "@/app/api/auth/[...nextauth]/options";

export const PATCH = async (req: NextRequest, context: any) => {
  try {
    await connectDB();

    const { userId, blogId } = await context.params;
    if (!isValidObjectId(userId) || !isValidObjectId(blogId)) {
      return NextResponse.json({
        success: false,
        message: "Invalid User or Blog ID",
        data: {},
      });
    }

    const session = await getServerSession(AuthOptions);
    if (session?.user._id !== userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
        data: {},
      });
    }

    const form = await req.formData();

    const thumbnailFile = form.get("thumbnail") as File | null;

    if (!thumbnailFile) {
      return NextResponse.json(
        { success: false, message: "No thumbnail found" },
        { status: 400 }
      );
    }

    const thumbnailArrayBuffer = await thumbnailFile.arrayBuffer();
    const thumbnailBuffer = Buffer.from(thumbnailArrayBuffer);
    const thumbnail = await uploadFile(thumbnailBuffer);

    if (!thumbnail) {
      return NextResponse.json(
        { success: false, message: "Error uploading thumbnail" },
        { status: 400 }
      );
    }

    const blog = await Blog.findOneAndUpdate(
      {
        _id: blogId,
        postedBy: session?.user._id,
      },
      {
        $set: { thumbnail },
      },
      { new: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
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
