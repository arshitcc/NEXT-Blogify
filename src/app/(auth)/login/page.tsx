"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubIcon, Mail } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/login.schema";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { loginMethod } from "@/types/user";

const page = () => {
  
  const { status } = useSession();
  const { login, isLoading, error } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      user: "",
      password: "",
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }

  const handleLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
  
    try {
      await login(loginMethod.CREDENTIALS, data);
      toast({
        title: "Success",
        description: "Login successful",
        variant: "default",
      });
      router.replace("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  };

  return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-[400px] p-6">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center">
              Welcome to Blogify
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to login
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLoginSubmit)}>
                <FormField
                  name="user"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input
                        type="password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Sign In"}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <Button type="button" variant="outline" onClick={() => login(loginMethod.GITHUB)}>
                    <GithubIcon className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button type="button" variant="outline" onClick={() => login(loginMethod.GOOGLE)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-center text-gray-700">
              Not a member?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
  );
};

export default page;

