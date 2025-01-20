"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { IBlog } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const page = () => {
  const { isLoading, error, profile, getProfile } = useUserStore();
  const { data : session } = useSession();

  useEffect(() => {
    const fetchProfile = async () => {
      await getProfile(session?.user?._id);
    };
    if(session?.user?._id){
      fetchProfile();
    }
  },[session]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={profile.avatar} alt={profile.username} />
                  <AvatarFallback>{profile?.username}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold mb-2">{profile.username}</h2>
                {profile.email && <p className="text-gray-600 mb-2">{profile.email}</p>}
                {profile.phone && <p className="text-gray-600 mb-2">{profile.phone}</p>}
                <Badge variant={profile.isVerified ? "default" : "secondary"}>
                  {profile.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        {/* Blogs List */}
        {isLoading ? (
          <BlogsSkeleton />
        ) : profile?.blogs && profile.blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile?.blogs.map((blog : IBlog) => (
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
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.body.toString()}</p>
                  <Link href={`/blog/${blog._id}`} className="text-blue-500 hover:underline">
                    Read More
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <NoPosts />
        )}
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-4 w-full">
    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
  </div>
);

const BlogsSkeleton = () => (
  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
    {[...Array(4)].map((_, index) => (
      <Card key={index} className="flex flex-col animate-pulse w-full">
        <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
        <CardContent className="flex-grow space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const NoPosts = () => (
  <Card className="md:col-span-2 text-center py-12">
    <CardContent>
      <p className="text-xl text-gray-600 mb-4">
        What's on your mind? Share with others!
      </p>
      <Link href={"/blog/new"}>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> New Post
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default page;
