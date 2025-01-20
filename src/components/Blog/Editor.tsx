"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RTE } from "./BlogEditor/RTE";
import { BlogPreview } from "./BlogPreview/BlogPreview";
import { IBlog } from "@/types/blog";

const Editor = ({ blog }: { blog?: IBlog }) => {
  const [post, setPost] = useState<Partial<IBlog>>({
    title: blog?.title || "",
    body: blog?.body || "",
    thumbnail: blog?.thumbnail || "",
    isActive: blog?.isActive || false,
  });

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
            blog={blog}
            post={post}
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
