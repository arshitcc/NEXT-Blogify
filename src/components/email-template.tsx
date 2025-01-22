import React from "react";

interface EmailTemplateProps {
  verify?: {
    email: string;
    verificationCode: string;
  };
  password?: {
    email: string;
    message: string;
    resetURL: string;
  };
  blog?: {
    blogId: string;
    title: string;
    url: string;
  };
}

export function EmailTemplate({ verify, password, blog }: EmailTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full">
        <div className="text-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Blogify</h1>
          <p className="text-gray-500">Your blogging companion</p>
        </div>
        <div className="p-6 space-y-6">
          {/* Verify Section */}
          {verify && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Verify Your Email
              </h2>
              <p className="text-gray-600">
                Hello! Thanks for signing up with Blogify. To get started,
                please verify your email address.
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center font-mono text-gray-800">
                <strong>
                  Your verification code: {verify.verificationCode}
                </strong>
              </div>
              <p className="text-gray-600">
                Enter this code on the verification Page to activate your
                account.
              </p>
            </div>
          )}
          {/* Password Reset Section */}
          {password && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Password Reset Request
              </h2>
              <p className="text-gray-600">{password.message}</p>
              <a
                href={password.resetURL}
                className="block bg-blue-500 text-white text-center py-2 rounded-md shadow hover:bg-blue-600"
              >
                Reset Password
              </a>
              <p className="text-sm text-gray-500 mt-2">
                If you didn’t request a password reset, please ignore this
                email.
              </p>
            </div>
          )}
          {/* Blog Live Section */}
          {blog && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Your Blog Post is Live!
              </h2>
              <p className="text-gray-600">
                Great news! Your blog post has been successfully published.
              </p>
              <p className="text-gray-800">
                <strong>Title:</strong> {blog.title}
              </p>
              <p className="text-gray-800">
                <strong>Blog ID:</strong> {blog.blogId}
              </p>
              <a
                href={blog.url}
                className="block bg-green-500 text-white text-center py-2 rounded-md shadow hover:bg-green-600"
              >
                View Your Blog Post
              </a>
            </div>
          )}
        </div>
        <div className="text-center p-4 border-t text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Blogify. All rights reserved.
        </div>
      </div>
    </div>
  );
}
