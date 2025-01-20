"use client";

import { useBlogStore } from "@/store/useBlogStore";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import React, { useEffect } from "react";

const Page = () => {
  const { blogId }: { blogId: string } = useParams();
  const { isLoading, blog, getBlog } = useBlogStore();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchBlog = async () => {
      await getBlog(blogId, session?.user._id);
    };

    if (blogId && session?.user._id) {
      fetchBlog();
    }
  }, [session]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8 md:px-8 lg:px-16">
      {isLoading || !blog ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-6">
            {blog?.title}
          </h1>
          <div className="prose prose-lg prose-blue mx-auto">{parse(blog.body || "")}</div>
        </div>
      )}
    </div>
  );
};

export default Page;
