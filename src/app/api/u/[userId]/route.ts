import { User } from "@/models/users.model";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose, { isValidObjectId } from "mongoose";

export const GET = async (req: NextRequest, context : any, res:NextResponse) => {
  // get user profile
  const { userId } = await context.params;
  if(!isValidObjectId(userId)){
    return NextResponse.json(
      { success: false, message: "Invalid User ID", data: {} },
      { status: 400 }
    );
  }
  
  try {
    await connectDB();
    const user = await User.aggregate([
      {
        $match : {
          _id : new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup : {
          from : "blogs",
          localField : "_id",
          foreignField : "postedBy",
          as : "blogs",
        }
      },
      {
        $project : {
          email: 0,
          password : 0,
          verificationCode : 0,
          verificationCodeExpiry : 0
        }
      }
    ])
    if (!user.length) {
      return NextResponse.json(
        { success: false, message: "User not found", data: {} },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User found", data: user[0] },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    );
  }
};

export const PATCH = async (req: Request) => {
 
  const session = await getServerSession(AuthOptions);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized Access. Please Login",
        data: {},
      },
      { status: 401 }
    );
  }

  const { password } = await req.json();
  if (!password.trim()) {
    return NextResponse.json(
      {
        success: false,
        message: "Password is required",
        data: {},
      },
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: session.user._id },
      { password: hashedPassword },
      { new: true }
    ).select('-password -verificationCode -verificationCodeExpiry');

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found", data: {} },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Password updated successfully", data: user },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", data: {} },
      { status: 500 }
    )
  }
};