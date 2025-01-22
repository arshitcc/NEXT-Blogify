import mongoose, { Document } from "mongoose";

export enum UserRoles {
  ADMIN = "admin",
  USER = "user",
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRoles;
  isVerified: boolean;
  verificationCode: string;
  verificationCodeExpiry: Date;
  avatar: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRoles,
      default: UserRoles.USER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationCodeExpiry: {
      type: Date,
      required: true,
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.users || mongoose.model("users", userSchema);
