import mongoose, { Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  comment: string;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.models.comments as mongoose.Model<IComment> || mongoose.model("comments", commentSchema);
