import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import axios from "axios";
import { blogSchema } from "@/schemas/blog.schema";
import { IBlogState } from "@/types/blog";
import { IBlog } from "@/types/blog";

axios.defaults.withCredentials = true;

const blogStore: StateCreator<IBlogState> = (set) => ({
  blog: {} as IBlog,
  isLoading: false,
  error: "",
  blogs: [] as IBlog[],

  getBlog: async (blogId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_END}/api/b/${blogId}`);
      if (res.data.success) {
        set({ blog: res.data.data });
      } else {
        set({ error: res.data.message });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  createBlog: async (blogData, userId) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_END}/api/u/${userId}/new-post`, blogData);
      if (!res.data.success) {
        set({ error: res.data.message });
        return false;
      }
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateBlog: async (blog, userId) => {
    set({ isLoading: true });
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_END}/api/u/${userId}/b/${blog._id}`, blog);
      if(res.data.success) {
        set({ blog: res.data.data });
        return true;
      }
      return false;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    } finally {
      set({isLoading: false});
    }
  },
  deleteBlog: async (blogId, userId) => {
    set({isLoading : true});
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_END}/api/u/${userId}/b/${blogId}`);
      if(res.data.success){
        return true;
      }
      return false;
    } catch (error: any) {
      set({error : error.message});
      return false;
    }
  },
});

export const useBlogStore = create<IBlogState>()(
  devtools(
    persist(blogStore, {
      name: "blog",
      storage: createJSONStorage(() => localStorage),
    })
  )
);
