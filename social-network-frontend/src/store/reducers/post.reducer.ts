import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "post";
export const resetState = createAction(`${name}/RESET_STATE`);

export interface UserInfo {
  uuid: string;
  username: string;
  lastUpdateAt: any;
}

export interface Reaction {
  createdAt: Date;
  createdBy: UserInfo;
}

export interface Comment {
  content: Content;
  createdAt: any;
  createdBy: UserInfo;
  uuid: string;
}

export interface ImageURLS {
  createdAt: any;
  name: string;
  url: string;
  uuid: string;
}
export interface Content {
  createdAt: any;
  createdBy: UserInfo;
  imageURLs: ImageURLS[];
  message: string;
  uuid: string;
}
export interface PostList {
  uuid: string;
  content: Content;
  reactions: Reaction[];
  comments: Comment[];
  status: string;
  user: UserInfo;
  createdDateAt: any;
}

export interface NewPost {
  fileUUID: any;
  message: string;
  imageURLs: any[];
  status: string;
}
export interface PostState {
  posts: PostList[];
  newPost: NewPost;
  friendPosts: PostList[];
  followPosts: PostList[];
  page: number;
  size: number;
}

// Initial state setup
export const initialState: PostState = {
  posts: [],
  newPost: {
    fileUUID: "",
    message: "",
    imageURLs: [],
    status: "PUBLIC",
  },
  friendPosts: [],
  followPosts: [],
  page: 1,
  size: 3,
};

// Create the slice
export const postSlice = createSlice({
  name,
  initialState,
  reducers: {
    setPosts: (state, { payload }: PayloadAction<PostList[]>) => {
      state.posts = payload;
    },
    appendPosts: (state, { payload }: PayloadAction<PostList[]>) => {
      state.posts = [...state.posts, ...payload];
    },
    // set friend posts
    setFriendPosts: (state, { payload }: PayloadAction<PostList[]>) => {
      state.friendPosts = payload;
    },
    appendFriendPosts: (state, { payload }: PayloadAction<PostList[]>) => {
      state.friendPosts = [...state.friendPosts, ...payload];
    },
    // set follow posts
    setFollowPosts: (state, { payload }: PayloadAction<PostList[]>) => {
      state.followPosts = payload;
    },
    appendFollowPosts: (state, { payload }: PayloadAction<PostList[]>) => {
      state.followPosts = [...state.followPosts, ...payload];
    },
    addPost: (state, { payload }: PayloadAction<PostList>) => {
      state.posts.push(payload);
    },
    appendCommentByPost: (state, { payload }: PayloadAction<any>) => {
      const { postId, comment } = payload;
      console.log("appendCommentByPost", postId, comment);
      const post = state.posts.find((post) => post.uuid === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
    setNewPost: (state, { payload }: PayloadAction<NewPost>) => {
      state.newPost = payload;
    },
    setNewPostImageURLs: (state, { payload }: PayloadAction<any[]>) => {
      state.newPost.imageURLs = payload;
    },
    // paginate
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.page = payload;
    },
    setSize: (state, { payload }: PayloadAction<number>) => {
      state.size = payload;
    },
    // change status this post to hidden
    updateStatusPost: (state, { payload }: PayloadAction<any>) => {
      const { postId, status } = payload;
      const post = state.posts.find((post) => post.uuid === postId);
      if (post) {
        post.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => initialState);
  },
});

export const sagaGetPosts = createAction(`${name}/GET_POST`);
export const TSagaGetPosts = createAction(
  `${name}/TEST_GET_POST`,
  (page: number, size: number) => ({ payload: { page, size } })
);
export const TSagaGetFriendPosts = createAction(
  `${name}/TEST_GET_FRIEND_POST`,
  (page: number, size: number) => ({ payload: { page, size } })
);
export const TSagaGetFollowPosts = createAction(
  `${name}/TEST_GET_FOLLOW_POST`,
  (page: number, size: number) => ({ payload: { page, size } })
);
export const createNewPost = createAction(`${name}/CREATE_NEW_POST`);
export const updateStatusPost = createAction(
  `${name}/UPDATE_STATUS_POST`,
  (postId: string, status: string) => ({ payload: { postId, status } })
);
export const sagaSetNumPosts = createAction(`${name}/SET_NUM_POSTS`);

// Selectors
export const selectState = (state: RootReducerType) => state[name];
export const selectPosts = createSelector(selectState, (state) => {
  // check post is owner current user login and public
  return state.posts.filter(
    (post) =>
      post.status === "PUBLIC" ||
      (post.status === "PRIVATE" && post.user.uuid === "1")
  );
});
export const selectFriendPosts = createSelector(
  selectState,
  (state) => state.friendPosts
);
export const selectFollowPosts = createSelector(
  selectState,
  (state) => state.followPosts
);
export const selectNewPost = createSelector(
  selectState,
  (state) => state.newPost
);

// paginate
export const selectPage = createSelector(selectState, (state) => state.page);
export const selectSize = createSelector(selectState, (state) => state.size);

export const { actions } = postSlice;
export const { setPosts, addPost, appendCommentByPost } = postSlice.actions;
export default postSlice;
