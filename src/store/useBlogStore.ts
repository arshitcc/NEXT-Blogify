import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import axios from "axios";
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
        return true;
      } else {
        set({ error: res.data.message });
        return false;
      }
    } catch (error: any) {
      set({ error: error.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  createBlog: async (blogData, userId, thumbnail) => {
    set({ isLoading: true });
    try {
      const blog = new FormData();
      if(blogData.title) blog.append('title', blogData.title);
      if(blogData.body) blog.append('body', blogData.body);
      if(thumbnail) blog.append('thumbnail', thumbnail);
      if(blogData.isActive) blog.append('isActive', String(blogData.isActive));

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_END}/api/u/${userId}/new-post`, blog);
      if (!res.data.success) {
        set({ error: res.data.message });
        return false;
      }
      set({ blog: res.data.data });
      return true;
    } catch (error: any) {
      set({ error: error.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  updateBlog: async (blog, userId, thumbnail) => {
    set({ isLoading: true });
    try {
      const blogData = new FormData();
      if(blog.title) blogData.append('title', blog.title);
      if(blog.body) blogData.append('body', blog.body);
      if(blog.thumbnail) blogData.append('thumbnail', JSON.stringify(blog.thumbnail));
      if(thumbnail) blogData.append('newThumbnail', thumbnail);
      if(blog.isActive) blogData.append('isActive', String(blog.isActive));

      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_END}/api/u/${userId}/b/${blog._id}`, blogData);
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
  updateThumbnail: async (blog,thumbnail,userId) => {
    set({isLoading : true});
    try {
      const blogData = new FormData();
      blogData.append('thumbnail', thumbnail);
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_END}/api/u/${userId}/b/${blog._id}/update-thumbnail`, blogData);
      if(res.data.success){
        return true;
      }
      return false;
    } catch (error: any) {
      set({error : error.message});
      return false;
    }
  }
});

export const useBlogStore = create<IBlogState>()(
  devtools(
    persist(blogStore, {
      name: "blog",
      storage: createJSONStorage(() => localStorage),
    })
  )
);
