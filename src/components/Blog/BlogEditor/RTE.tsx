"use client";

import { IBlog } from "@/models/blogs.models";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import "./index.css";
import { MenuBar } from "./MenuBar";
import { Button } from "@/components/ui/button";

export const RTE = ({ blog, onContentSave }: { blog?: IBlog, onContentSave: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Underline],
    content: ``,
  });

  if (!editor) {
    return null;
  }

  const handleSaveAsDraft = () => {
    onContentSave(editor.getHTML());
  }

  return (
    <div className="relative">
      <MenuBar editor={editor} />
      <EditorContent className="overflow-y-scroll border-2 rounded-lg p-2" editor={editor} />
      <Button onClick={handleSaveAsDraft} className="mt-4 ">
        Save as Draft
      </Button>
    </div>
  );
};
