"use client";

import React, { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";

const page = () => {
  const [user, setUser] = useState();
  const [password, setPassword] = useState();
  const session = useSession();
  if(session.status === "authenticated"){
    return (
      <>
      Welcome 
      <div>
        <button onClick={() => signOut()} className="bg-black text-white rounded-xl px-8 py-2">Logout</button>
      </div>
      </>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn("credentials", {
      redirect: false,
      user,
      password,
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto min-h-screen flex flex-col justify-center items-center gap-4">
      <div className="flex flex-col gap-2 max-w-[400px]">
        <input
          className="focus:outline-none border border-gray-400 p-2"
          type="text"
          name="user"
          id="user"
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="focus:outline-none border border-gray-400 p-2"
          type="text"
          name="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-black text-white border border-gray-400 p-2 rounded-xl px-8 py-2"
          onClick={handleSubmit}
        >
          Hello
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={() => signIn("google")} className="bg-black text-white rounded-xl px-8 py-2">Login with Google</button>
        <button onClick={() => signIn("github")} className="bg-black text-white rounded-xl px-8 py-2">Login with Github</button>
      </div>

      
    </div>
  );
};

export default page;
