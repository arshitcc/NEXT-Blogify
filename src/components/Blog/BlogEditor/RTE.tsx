"use client";

import { IBlog } from "@/types/blog";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import "./index.css";
import { MenuBar } from "./MenuBar";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, SaveIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBlogStore } from "@/store/useBlogStore";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";

export const RTE = ({
  blog,
  post,
  onContentSave,
  onTabChange,
}: {
  blog?: IBlog;
  post: Partial<IBlog>;
  onContentSave: (post: Partial<IBlog>) => void;
  onTabChange: (tab: string) => void;
}) => {

 
  const { isLoading, error, createBlog, updateBlog } = useBlogStore();
  const { data: session } = useSession();
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content: blog?.body || post?.body || ``,
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
      const res = await updateBlog({...post, title: post.title, body: editor.getHTML()}, post.postedBy);
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      }
      onContentSave({ ...blog, title: post.title, body: editor.getHTML() });
      return;
    }

    if (post) {
      const res = await createBlog({...post, title: post.title, body: editor.getHTML()}, session?.user._id);
      if (res) {
        toast({
          title: "Success",
          description: "Blog saved as draft successfully",
          variant: "default",
        });
      }
      onContentSave({ ...post, title: post.title, body: editor.getHTML() });
      return;
    }
  };

  return (
    <div className="relative">
      <MenuBar editor={editor} />
      <Input
        value={blog?.title || post?.title || ""}
        onChange={(e) =>
          blog
            ? onContentSave({ ...blog, title: e.target.value })
            : onContentSave({ ...post, title: e.target.value })
        }
        className="text-4xl border-2 rounded-lg  h-12 my-4"
        placeholder="Title"
      />
      <EditorContent
        className="overflow-y-scroll border-2 rounded-lg p-2"
        editor={editor}
      />
      <div className="flex gap-4">
        <Button onClick={handleSaveAsDraft} className="mt-4 ">
          Save as Draft <SaveIcon />
        </Button>
        <Button onClick={() => onTabChange('preview')} className="mt-4 ">
          Go to Preview <ExternalLinkIcon />
        </Button>
      </div>
    </div>
  );
};
