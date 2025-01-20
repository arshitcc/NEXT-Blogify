import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import axios from "axios";
import { IUserState } from "@/types/user";
import { z } from "zod";
import { signupSchema } from "@/schemas/signup.schema";
import { loginSchema } from "@/schemas/login.schema";
import { signIn, signOut } from "next-auth/react";
import { loginMethod } from "@/types/user";

axios.defaults.withCredentials = true;

const userStore: StateCreator<IUserState> = (set) => ({
  user: null,
  profile: null,
  isLoading: false,
  error: "",
  signup: async (data: Omit<z.infer<typeof signupSchema>,'confirmPassword'>) => {
    set({ isLoading: true });
    try {
        await axios.post("/api/signup", data);
        return true;
    } catch (error : any) {
        set({ error: error.response.data.message });
        console.log(error);
    } finally {
        set({ isLoading: false });
    }
    return false;
  },
  login: async (method: loginMethod, data?: z.infer<typeof loginSchema>) => {
    set({ isLoading: true });
    try {
        await signIn(method, {
          redirect: false,
          ...data,
        });
    } catch (error) {
        console.log(error);
    } finally {
        set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
        const res = await signOut();
        console.log(res);
    } catch (error) {
        console.log(error);
    } finally {
        set({ isLoading: false });
    }
  },
  getProfile: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`api/u/${userId}`);
      set({ profile: res.data.data });
    } catch (error : any) {
      set({ error: error.message });
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
