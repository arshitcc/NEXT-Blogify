import { Comment, IComment } from "@/models/comments.models";
import { connectDB } from "@/lib/db";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, context: any) => {
  // delete Comment
  try {
    await connectDB();
    const { blogId, commentId } = await context.params;
    if (!isValidObjectId(blogId) || !isValidObjectId(commentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Blog or Comment", data: {} },
        { status: 400 }
      );
    }

    // TODO : authentication has to be checked

    const comment = await Comment.findOneAndDelete({ _id: commentId, blogId });

    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized  or Comment not found",
          data: {},
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Comment deleted", data: {} },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    );
  }
};
