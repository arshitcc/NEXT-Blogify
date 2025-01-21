import { create, StateCreator } from "zustand";
import { IComment, ICommentState } from "@/types/blog";
import axios from "axios";
import { createJSONStorage, devtools, persist } from "zustand/middleware";


const commentStore : StateCreator<ICommentState> = (set) => ({
    isLoading : false,
    error : "",

    addComment : async (comment) => {
        set({isLoading : true});
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_END}/api/b/${comment.blogId}/new-comment`, comment);
            if(res.data.success) return true;
            else return false
        } catch (error : any) {
            set({error : error.message});
            return false;
        } finally {
            set({isLoading: false})
        }
    },
    removeComment: async (comment) => {
        set({isLoading : true});
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_END}/api/b/${comment.blogId}/c/${comment._id}`);
            if(res.data.success) return true;
            else return false
        } catch (error : any) {
            set({error : error.message});
            return false;
        } finally {
            set({isLoading: false})
        }
    }
})

export const useCommentStore = create<ICommentState>()(
  devtools(
    persist(commentStore, {
      name: "comment",
      storage: createJSONStorage(() => localStorage),
    })
  )
);
