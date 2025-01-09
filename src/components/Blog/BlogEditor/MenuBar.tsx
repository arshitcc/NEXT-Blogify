"use client";

import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  TextQuoteIcon,
  List,
  ListOrdered,
  Heading,
  ImagePlusIcon,
  UnderlineIcon,
} from "lucide-react";
import { useCallback } from "react";

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const handleAddImage = useCallback(() => {
    console.log("first");
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-4 m-4 overflow-x-auto sticky top-10 z-10">
      <Button
        variant={editor.isActive("bold") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive("italic") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive("strike") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive("underline") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive("code") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <TextQuoteIcon className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Heading className="w-4 h-4" />
            Headings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <DropdownMenuItem
              key={level}
              className={`cursor-pointer ${
                editor.isActive("heading", { level }) ? "text-blue-500" : ""
              }`}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                  .run()
              }
            >
              H{level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleAddImage}>
        <ImagePlusIcon className="w-4 h-4" />
      </Button>
      <Button
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="w-4 h-4" />
      </Button>
      {""}
      <Button
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        onClick={() =>
          editor.chain().focus().toggleList("orderedList", "listItem").run()
        }
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        disabled={!editor.can().sinkListItem("listItem")}
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sink List
      </Button>
      <Button
        disabled={!editor.can().splitListItem("listItem")}
        onClick={() => editor.chain().focus().splitListItem("listItem").run()}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Split List
      </Button>
    </div>
  );
};
