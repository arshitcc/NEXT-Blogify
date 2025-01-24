"use client";

import { IBlog } from "@/types/blog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import "./index.css";
import { MenuBar } from "./MenuBar";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, ImageDown, SaveIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBlogStore } from "@/store/useBlogStore";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";

export const RTE = ({
  post,
  thumbnail,
  onContentSave,
  onThumbnailSave,
  onTabChange,
}: {
  post: Partial<IBlog>;
  thumbnail: File | null;
  onContentSave: (post: Partial<IBlog>) => void;
  onThumbnailSave: (thumbnail: File|null) => void;
  onTabChange: (tab: string) => void;
}) => {
  const {
    isLoading,
    error,
    blog: created_blog,
    createBlog,
    updateBlog,
  } = useBlogStore();
  const { data: session } = useSession();
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content: post?.body || ``,
  });

  if (!editor) {
    return null;
  }

  const handleSaveAsDraft = async () => {
    if (editor.getText() === "") {
      toast({
        title: "Error",
        description: "Blog content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (post._id?.trim() && post.postedBy?.trim()) {
      const res = await updateBlog(
        { ...post, title: post.title, body: editor.getHTML() },
        post.postedBy,
        thumbnail
      );
      if (res) {
        toast({
          title: "Success",
          description: "Blog Updated successfully",
          variant: "default",
        });
      }
      onContentSave({
        ...post,
        title: post.title,
        body: editor.getHTML(),
        thumbnail: created_blog?.thumbnail,
        _id: created_blog?._id || "",
        postedBy: created_blog?.postedBy || "",
      });
      onThumbnailSave(null)
      return;
    }

    if (post) {
      const res = await createBlog(
        { ...post, title: post.title, body: editor.getHTML() },
        session?.user._id,
        thumbnail
      );
      if (res) {
        toast({
          title: "Success",
          description: "New Blog created and saved as draft  successfully",
          variant: "default",
        });
      }
      onContentSave({
        ...post,
        title: post.title,
        body: editor.getHTML(),
        thumbnail: created_blog?.thumbnail,
        _id: created_blog?._id,
        postedBy: created_blog?.postedBy,
      });
      onThumbnailSave(null);
      return;
    }
  };

  return (
    <div className="relative">
      <MenuBar editor={editor} />
      <div className="flex justify-center items-center gap-2">
        <Input
          value={post?.title || ""}
          onChange={(e) => onContentSave({ ...post, title: e.target.value })}
          className="flex-1 w-[90%] text-xl md:text-2xl border-2 rounded-lg h-12 my-4"
          placeholder="Title"
        />
        <div className="relative group flex items-center w-[10%] h-full justify-center">
          <ImageDown className="h-6 w-6" />
          <Input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => onThumbnailSave(e.target.files?.[0] || null)}
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {post?.thumbnail?.url.trim() ? "Change Thumbnail" : "Add Thumbnail"}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-t-gray-800 border-transparent"></div>
          </div>
        </div>
      </div>
      <EditorContent
        className="overflow-y-scroll border-2 rounded-lg p-2"
        editor={editor}
      />
      <div className="flex gap-4">
        <Button onClick={handleSaveAsDraft} disabled={isLoading} className="mt-4 ">
          Save as Draft <SaveIcon />
        </Button>
        <Button onClick={() => onTabChange("preview")} className="mt-4 ">
          Go to Preview <ExternalLinkIcon />
        </Button>
      </div>
    </div>
  );
};
