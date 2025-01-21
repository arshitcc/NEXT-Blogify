"use client";

import { useBlogStore } from "@/store/useBlogStore";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import React, { useEffect } from "react";
import Comments from "@/components/Comment/Comment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Edit3Icon } from "lucide-react";

const Page = () => {
  const { blogId }: { blogId: string } = useParams();
  const { isLoading, blog, getBlog } = useBlogStore();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      await getBlog(blogId, session?.user._id);
    };

    if (blogId && session?.user._id) {
      fetchBlog();
    }
  }, [session]);

  console.log(blog && blog?.postedBy === session?.user._id)

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
          <div className="prose prose-lg prose-blue mx-auto">
            {parse(blog.body || "")}
          </div>
          <div className="mt-12">
            <Comments blog={blog} />
          </div>
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="font-semibold">
                  Comments ({blog.comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {blog.comments && blog.comments.length > 0 ? (
                  blog.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="p-4 border-b last:border-none"
                    >
                      <p className="text-sm font-semibold">{comment.userId}</p>
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
          {blog && (blog?.postedBy === session?.user._id) && (
            <div className="fixed top-24 right-40">
              <Button
                variant="default"
                onClick={() => router.replace(`/blog/edit/${blog._id}`)}
              >
                Edit <Edit3Icon/>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
