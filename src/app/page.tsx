import { RTE } from "@/components/Blog/BlogEditor/RTE";
import React from "react";
import { BlogPreview } from "@/components/Blog/BlogPreview/BlogPreview";
import Editor from "@/components/Blog/Editor";

const page = () => {

  return (
    <div className="container min-h-screen mx-auto p-4">
      <Editor/>
    </div>
  );
};

export default page;
