import mongoose, { Document } from "mongoose";

export interface IBlog extends Document {
  _id: mongoose.Types.ObjectId;
  thumbnail: {
    public_id : string,
    url : string,
  },
  title: string;
  slug: string;
  body: string;
  views: number;
  postedBy: mongoose.Types.ObjectId;
  isActive: boolean;
}

const blogSchema = new mongoose.Schema<IBlog>(
  {
    thumbnail: {
      public_id : {
        type: String,
        default: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=600"
      },
      url : {
        type: String,
        default: "https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=600"
      }
    },
    title: {
      type: String,
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
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.models.blogs as mongoose.Model<IBlog> || mongoose.model("blogs", blogSchema);
