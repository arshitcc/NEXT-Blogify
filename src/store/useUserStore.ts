import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import axios from "axios";
import { IUserState } from "@/types/user";
import { z } from "zod";
import { signupSchema } from "@/schemas/signup.schema";
import { loginSchema } from "@/schemas/login.schema";
import { signIn, signOut } from "next-auth/react";
import { loginMethod } from "@/types/user";
import { IBlog } from "@/types/blog";
import { IUser } from "@/types/user";

axios.defaults.withCredentials = true;

const userStore: StateCreator<IUserState> = (set) => ({
  user: null,
  profile: {} as IUser & {
    blogs: IBlog[];
  },
  isLoading: false,
  error: "",
  signup: async (data: Omit<z.infer<typeof signupSchema>,'confirmPassword'>) => {
    set({ isLoading: true });
    try {
        await axios.post("/api/signup", data);
        return true;
    } catch (error : any) {
        set({ error: error.response.data.message });
    } finally {
        set({ isLoading: false });
    }
    return false;
  },
  login: async (method: loginMethod, data?: z.infer<typeof loginSchema>) => {
    set({ isLoading: true });
    try {
        const res = await signIn(method, {
          redirect: false,
          ...data,
        });
        if(res?.ok){
          return true;
        }
        else {
          return false;
        }
    } catch (error) {
        set({ error: "Something went wrong" });
        return false;
    } finally {
        set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
        await signOut();
        return true;
    } catch (error) {
        set({ error: "Something went wrong" });
        return false;
    } finally {
        set({ isLoading: false });
    }
  },
  getProfile: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`api/u/${userId}`);
      if(res.data.success) {
        set({ profile: res.data.data });
        return true;
      }
      return false;
    } catch (error : any) {
      set({ error: error.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
});

export const useUserStore = create<IUserState>()(
  devtools(
    persist(userStore, {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    })
  )
);
