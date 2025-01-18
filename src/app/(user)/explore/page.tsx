"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { blogs } from "../../../assets/explore-blogs.json";

export default function Explore() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Explore Blogs
      </h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 relative">
        {blogs.map((blog) => (
          <CardContainer
            key={blog.id}
            className="group relative"
          >
            <CardBody className="bg-gray-50 relative group-hover:z-500 group-hover:scale-105 group-hover:shadow-2xl dark:group-hover:shadow-emerald-500/20 dark:bg-black dark:border-white/20 border-black/10 w-auto sm:w-[30rem] h-auto rounded-xl p-6 border transition-transform duration-300 ease-out">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {blog.title}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm mt-2 dark:text-neutral-300"
              >
                By {blog.author} • {blog.category}
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <img
                  src={blog.image || "/placeholder.svg"}
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover:shadow-xl transition-shadow duration-300"
                  alt={blog.title}
                />
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm mt-4 dark:text-neutral-300"
              >
                {blog.description}
              </CardItem>
              <div className="flex justify-end items-center mt-8">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                >
                  Read More
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
}
