"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBlogStore } from "@/store/useBlogStore";
import { IBlog } from "@/types/blog";
import { useSession } from "next-auth/react";
import parse from "html-react-parser";
import { ArrowUpLeftFromSquareIcon, Edit3Icon, SaveIcon, Share } from "lucide-react";
import "@/components/Blog/BlogEditor/index.css";

export const BlogPreview = ({
  post,
  onTabChange,
}: {
  post: Partial<IBlog>;
  onTabChange: (tab: string) => void;
}) => {
  const { createBlog, updateBlog } = useBlogStore();
  const { toast } = useToast();
  const { data: session } = useSession();
  if (!post.body?.trim()) {
    return <WriteSomething />;
  }

  const handleSaveAsDraft = async () => {
    if (post._id?.trim() && post.postedBy?.trim()) {
      const res = await updateBlog({...post}, post.postedBy);
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      }
      else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
      return;
    }

    if (post) {
      const res = await createBlog({...post}, session?.user._id);
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      }
      else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };

  const handlePublishBlog = async () => {
    try {
      if (post._id?.trim() && post.postedBy?.trim()) {
        const res = await updateBlog(post, session?.user._id);
        if (res) {
          toast({
            title: "Success",
            description: "Your blog has been published successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to Publish Post",
            variant: "destructive",
          });
        }
      }

      if (post) {
        const res = await createBlog(post, session?.user._id);
        if (res) {
          toast({
            title: "Success",
            description: "Your blog has been published successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to Publish Post",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="tiptap min-h-[70vh] overflow-y-scroll border-2 rounded-lg p-2">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-6">
            {post.title}
          </h1>
        {parse(post.body)}
      </div>
      <div className="flex gap-4">
        <Button onClick={handleSaveAsDraft} className="mt-4 ">
          Save as Draft <SaveIcon />
        </Button>
        <Button onClick={() => onTabChange("editor")} className="mt-4 ">
          <ArrowUpLeftFromSquareIcon/> Edit This
        </Button>
        <Button onClick={handlePublishBlog} className="mt-4 ">
          Publish the Thought <Share />
        </Button>
      </div>
    </div>
  );
};

const WriteSomething = () => {
  return (
    <>
      <div className="w-full">Write Something u Asshole</div>
    </>
  );
};
