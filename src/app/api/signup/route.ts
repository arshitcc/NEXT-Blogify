import { connectDB } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/resend";
import { User } from "@/models/users.model";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, email, password } = await req.json();

    const isExistingUsername = await User.findOne({ username });
    if(isExistingUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    const isExistingUser = await User.findOne({ email });
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (isExistingUser) {
      if (isExistingUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Account already exsists from this email",
          },
          { status: 400 }
        );
      } 
      else {
        const hashedPassword = await bcrypt.hash(password, 10);
        isExistingUser.password = hashedPassword;
        isExistingUser.verificationCode = verificationCode;
        isExistingUser.verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
        isExistingUser.username = username;
        await isExistingUser.save();
      }
    } 
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiry,
      });
    }

    const res = await sendVerificationEmail(email, verificationCode);
    if (!res.success) {
      return Response.json({ 
        success: false, 
        message: res.message 
      },
      { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Signup Completed Successfully. Please check your email to verify your account",
      },
      { status: 200 }
    );
  } catch (error : any) {
    console.log("Error signing up user : ", error);
    return Response.json(
      {
        success : false,
        message : "Error signing up user"
      },
      { status : 500}
    )
  }
}
