import { Comment, commentSchema } from "@/schemas/comment.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon, LogInIcon } from "lucide-react";
import { IBlog } from "@/types/blog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCommentStore } from "@/store/useCommentStore";
import { Card, CardContent } from "../ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Comments = ({ blog }: { blog: IBlog }) => {
  const { isLoading, error, addComment } = useCommentStore();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleCommentSubmit = async (data: Comment) => {
    try {
      const res = await addComment({
        userId: session?.user._id,
        blogId: blog._id,
        comment: data.comment,
      });
      if (res) {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
        form.reset();
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
    }
  };

  return (
    <div className="space-y-6">

      {/* Login Dialog */}
      {!session && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Log in to comment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Required</DialogTitle>
              <DialogDescription>
                You need to be logged in to post a comment.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => router.push("/auth/login")}
                className="flex items-center space-x-2"
              >
                <LogInIcon className="w-4 h-4" />
                <span>Login</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Comment Form */}
      {session && (
        <div>
          <h3 className="text-lg font-semibold">
            What&apos;s your thought on this ?
          </h3>
          <Card>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCommentSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Comment</FormLabel>
                        <Input
                          {...field}
                          placeholder="Write your comment here..."
                          className="resize-none"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="max-w-xl mx-auto flex items-center justify-center space-x-2"
                  >
                    <SendIcon className="w-4 h-4" />
                    <span>Post Comment</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Comments;
