'use client'

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {RTE} from "./BlogEditor/RTE";
import { BlogPreview } from "./BlogPreview/BlogPreview";
import { IBlog } from "@/models/blogs.models";


const Editor = ({blog} : {blog?: IBlog}) => {

  const [content, setContent] = React.useState<string>("");

  return (
    <div >
      <Tabs defaultValue="editor">
        <TabsList className="w-full">
          <TabsTrigger className="w-1/2" value="editor">Editor</TabsTrigger>
          <TabsTrigger className="w-1/2" value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <RTE blog={blog} onContentSave={setContent}/>
        </TabsContent>
        <TabsContent value="preview"><BlogPreview content={content}/></TabsContent>
      </Tabs>
    </div>
  );
};

export default Editor;
