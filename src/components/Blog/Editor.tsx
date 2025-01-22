"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RTE } from "./BlogEditor/RTE";
import { BlogPreview } from "./BlogPreview/BlogPreview";
import { IBlog } from "@/types/blog";
import "@/components/Blog/BlogEditor/index.css";

const Editor = ({ blog }: { blog?: IBlog }) => {
  const [post, setPost] = useState<Partial<IBlog>>({
    _id: blog?._id || "",
    title: blog?.title || "",
    body: blog?.body || "",
    thumbnail: {
      public_id: blog?.thumbnail.public_id || "",
      url: blog?.thumbnail.url || "",
    },
    isActive: blog?.isActive || false,
    postedBy: blog?.postedBy || ""
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [tab, setTab] = useState<string>("editor");

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger className="w-1/2" value="editor">
            Editor
          </TabsTrigger>
          <TabsTrigger className="w-1/2" value="preview">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <RTE
            post={post}
            thumbnail={thumbnail}
            onThumbnailSave={setThumbnail}
            onContentSave={setPost}
            onTabChange={setTab}
          />
        </TabsContent>
        <TabsContent value="preview">
          <BlogPreview post={post} onTabChange={setTab} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Editor;
