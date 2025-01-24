interface Thumbnail {
  public_id: string;
  url: string;
}
export interface IBlog {
  _id: string;
  thumbnail: Thumbnail;
  title: string;
  slug: string;
  body: string;
  views: number;
  postedBy: string;
  isActive: boolean;
  comments: IComment[];
  size: number;
}

export interface IComment {
  _id: string;
  blogId: string;
  userId: string;
  comment: string;
}

export interface ICommentState {
  isLoading: boolean;
  error: string;
  addComment: (comment: Omit<IComment,'_id'>) => Promise<boolean>;
  removeComment: (comment: IComment) => Promise<boolean>;
}

export interface IBlogState {
  blog: IBlog | null;
  isLoading: boolean;
  error: string;
  blogs: IBlog[];

  getBlog: (blogId: string, userId : string) => Promise<boolean>;
  createBlog: (blogData: Partial<IBlog>, userId : string, thumbnail?: File | null) => Promise<boolean>;
  updateBlog: (blog: Partial<IBlog>, userId : string, thumbnail?: File | null) => Promise<boolean>;
  deleteBlog: (blogId: string, userId: string) => Promise<boolean>;
  updateThumbnail: (blog: Partial<IBlog>, thumbnail: File, userId: string) => Promise<boolean>;
}

