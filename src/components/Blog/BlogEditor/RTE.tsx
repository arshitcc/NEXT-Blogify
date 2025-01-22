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
  onThumbnailSave: (thumbnail: File) => void;
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
        post.postedBy
      );
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      }
      onContentSave({
        ...post,
        title: post.title,
        body: editor.getHTML(),
        _id: created_blog?._id || "",
        postedBy: created_blog?.postedBy || "",
      });
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
          description: "Blog saved as draft successfully",
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
        <div className="relative flex items-center w-[10%] h-full justify-center">
          <ImageDown className="h-6 w-6" />
          <Input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target?.files?.[0];
              if (file) {
                onThumbnailSave(file);
              }
            }}
          />
        </div>
      </div>
      <EditorContent
        className="overflow-y-scroll border-2 rounded-lg p-2"
        editor={editor}
      />
      <div className="flex gap-4">
        <Button onClick={handleSaveAsDraft} className="mt-4 ">
          Save as Draft <SaveIcon />
        </Button>
        <Button onClick={() => onTabChange("preview")} className="mt-4 ">
          Go to Preview <ExternalLinkIcon />
        </Button>
      </div>
    </div>
  );
};
