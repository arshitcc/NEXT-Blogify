"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useBlogStore } from "@/store/useBlogStore";
import { IBlog } from "@/types/blog";
import { useSession } from "next-auth/react";
import parse from "html-react-parser";
import { Edit3Icon, SaveIcon, Share } from "lucide-react";

export const BlogPreview = ({
  post,
  blog,
  onTabChange,
}: {
  post: Partial<IBlog>;
  blog?: IBlog;
  onTabChange: (tab: string) => void;
}) => {
  const { isLoading, error, createBlog, updateBlog } = useBlogStore();
  const { toast } = useToast();
  const { data: session } = useSession();
  if (!post.body?.trim()) {
    return <WriteSomething />;
  }

  const handleSaveAsDraft = async () => {
    if (!blog) {
      const res = await createBlog({ ...post }, session?.user._id);
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save blog as draft",
          variant: "destructive",
        });
      }
    } else {
      const res = await updateBlog(blog, session?.user._id);
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save blog as draft",
          variant: "destructive",
        });
      }
    }
  };

  const handlePublishBlog = async () => {
    try {
      if (blog) {
        const res = await updateBlog(blog, session?.user._id);
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
      <h1 className="text-4xl font-semibold">{blog?.title || post.title}</h1>
      <div className="tiptap min-h-[60vh]">
        {parse(blog?.body || post.body)}
      </div>
      <div className="flex gap-4">
        <Button onClick={handleSaveAsDraft} className="mt-4 ">
          Save as Draft <SaveIcon />
        </Button>
        <Button onClick={() => onTabChange("editor")} className="mt-4 ">
          Edit This <Edit3Icon />
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
