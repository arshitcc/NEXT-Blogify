"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verify.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const { username } = useParams();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  const handleVerify = async (data: z.infer<typeof verifySchema>) => {
    const { verificationCode } = data;
    if (verificationCode.length === 6) {
      setVerifying(true);

      try {
        const response = await axios.post(`/api/verify`, {
          username,
          verificationCode,
        });
        if (response.data.success) {
          toast({
            title: "Success",
            description: "Your account has been verified. You can now login",
            variant: "default",
          });
          router.replace("/login");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    }
  };

  return (
    <div className="flex justify-center bg-gray-900 items-center min-h-screen p-2">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleVerify)}
            className="space-y-6"
          >
            <FormField
              name="verificationCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={verifying}>
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
