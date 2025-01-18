"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const user = {
  _id: "1",
  username: "johndoe",
  email: "john@example.com",
  phone: "1234567890",
  role: "user",
  isVerified: true,
  avatar: "https://avatars.githubusercontent.com/u/118971735?v=4",
};

const blogs = [
  {
    _id: "1",
    thumbnail: "",
    title: "My First Blog",
    slug: "",
    body: "This is the content of my first blog...",
    views: 3,
    postedBy: "1",
  },
  {
    _id: "2",
    thumbnail: "",
    title: "Another Great Blog",
    slug: "",
    body: "This is the content of another great blog...",
    views: 12,
    postedBy: "1",
  },
];


const page = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-2">{user.username}</h2>
            <p className="text-gray-600 mb-2">{user.email}</p>
            <p className="text-gray-600 mb-2">{user.phone}</p>
            <Badge variant={user.isVerified ? "default" : "secondary"}>
              {user.isVerified ? "Verified" : "Unverified"}
            </Badge>
          </CardContent>
        </Card>

        {/* Blogs List */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {blogs.map((blog) => (
              <Card key={blog._id.toString()} className="flex flex-col">
                <Image
                  src={blog.thumbnail || "/placeholder.svg"}
                  alt={blog.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardContent className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.body}</p>
                  <Link
                    href={`/blog/${blog._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Read More
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
