"use client";

import React from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { WavyBackground } from "@/components/ui/wavy-background";
import { SparklesCore } from "@/components/ui/sparkles";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useRouter } from "next/navigation";
import data from "@/assets/blogs.json";
import Image from "next/image";

const blogs = data.blogs;

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center pt-20 pb-10"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Welcome to BlogHub</span>
            <span className="block text-indigo-400">Share Your Stories</span>
          </h1>
          <TextGenerateEffect
            words="Join our community of writers and readers"
            className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
          />
          <div className="mt-5 flex justify-center gap-3 md:mt-8">
            {["Get Started", "Learn More"].map((text, index) => (
              <motion.a
                key={text}
                href={`/${index === 0 ? "signup" : "about"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-md font-medium md:py-4 md:px-10 md:text-lg ${
                  index === 0
                    ? "text-white bg-indigo-600 hover:bg-indigo-700"
                    : "text-indigo-600 bg-white hover:bg-gray-50"
                }`}
              >
                {text}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </WavyBackground>

      {/* Featured Posts */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Featured Posts
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <CardContainer key={blog.id}>
              <CardBody className="bg-gray-50 dark:bg-black dark:border-gray-700 border rounded-xl p-6 shadow group transition">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-gray-700 dark:text-white truncate"
                >
                  {blog.title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="mt-2 text-sm text-gray-500 dark:text-gray-300"
                >
                  {blog.description}
                </CardItem>
                <CardItem translateZ="100" className="mt-4">
                  <Image
                    src={blog.image}
                    className="h-60 w-full object-cover rounded-xl shadow-sm"
                    alt="Thumbnail"
                    width={1000}
                    height={1000}

                  />
                </CardItem>
                <div className="flex justify-between items-center mt-6">
                  {["Try Now →", "Read More"].map((text, idx) => (
                    <CardItem
                      key={text}
                      translateZ={20}
                      as="button"
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${
                        idx === 0
                          ? "text-gray-700 dark:text-white"
                          : "text-white bg-black dark:bg-white dark:text-black"
                      }`}
                    >
                      {text}
                    </CardItem>
                  ))}
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative h-[40rem] flex items-center justify-center bg-slate-900">
        <BackgroundBeams />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <h2 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-gray-50 to-gray-400">
            Ready to start blogging?
          </h2>
          <p className="mt-4 text-base md:text-lg text-gray-300 max-w-lg mx-auto">
            Join our community and start sharing your stories with readers
            around the world.
          </p>
          <motion.button
            className="px-6 py-3 mt-8 text-sm font-bold bg-white text-black rounded-lg hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/signup")}
          >
            Sign up for free
          </motion.button>
        </motion.div>
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="absolute inset-0 w-full h-full z-0"
          particleColor="#FFFFFF"
        />
      </section>
    </div>
  );
}
