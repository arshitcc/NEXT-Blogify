import mongoose, { Document } from "mongoose";

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;
  thumbnail: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  postedBy: mongoose.Types.ObjectId;
}

const blogSchema = new mongoose.Schema<IBlog>(
  {
    thumbnail: {
      type: String,
      required: true,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    body: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.blogs as mongoose.Model<IBlog> || mongoose.model("blogs", blogSchema);
