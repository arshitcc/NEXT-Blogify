"use client";

import React, { useEffect } from "react";
import Editor from "@/components/Blog/Editor";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useBlogStore } from "@/store/useBlogStore";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { blogId }: { blogId: string } = useParams();
  const { data: session } = useSession();
  const { isLoading, blog, getBlog } = useBlogStore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getBlog(blogId, session?.user._id);
      if (!blog || !res) {
        toast({
          title: "Failed",
          description: "Invalid || Blog cannot be accessed",
          variant: "destructive",
        });
        router.replace(`/profile`)
      }
    };
    if (blogId && session?.user._id) {
      fetchBlog();
    }
  }, [blogId, session]);

  if(blog && session && (blog.postedBy!==session.user._id)){
    router.replace(`/b/${blog._id}`)
  }

  if (blog && session && (blog._id===blogId) && (blog.postedBy === session.user._id)) {
    return (
      <div className="container min-h-screen mx-auto p-4">
        <Editor blog={blog} />
      </div>
    );
  }
  return (
    isLoading && (
      <>
        <div>Loading Editor</div>
      </>
    )
  );
};

export default page;
