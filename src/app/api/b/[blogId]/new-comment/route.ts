import { IComment, Comment } from "@/models/comments.models";
import { connectDB } from "@/lib/db";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const POST = async (req: NextRequest, context: any) => {
  // add Comment
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: {} },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const { blogId } = await context.params;
    if (!isValidObjectId(blogId) || !isValidObjectId(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid User or Blog ID", data: {} },
        { status: 400 }
      );
    }

    const { comment }: IComment = await req.json();
    if (!comment?.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment is required", data: {} },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      blogId,
      userId,
      comment,
    });

    return NextResponse.json(
      { success: true, message: "Comment created", data: newComment },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    );
  }
};
