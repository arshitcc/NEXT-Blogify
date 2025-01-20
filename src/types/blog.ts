export interface IBlog {
  _id: string;
  thumbnail: string;
  title: string;
  slug: string;
  body: string;
  views: number;
  postedBy: string;
}

export interface IComment {
  _id: string;
  blogId: string;
  userId: string;
  comment: string;
}

export interface ICommentState {
  comments: IComment[];
  isLoading: boolean;
  error: string;
  addComment: (comment: Omit<IComment,'_id'>) => Promise<void>;
  removeComment: (id: string) => Promise<void>;
}

export interface IBlogState {
  blog: IBlog | null;
  isLoading: boolean;
  error: string;
  blogs: IBlog[];

  getBlog : (blogId: string) => Promise<void>;
  createBlog : (blog: IBlog) => Promise<void>;
  updateBlog : (blog: IBlog) => Promise<void>;
  deleteBlog : (id: string) => Promise<void>;
}

