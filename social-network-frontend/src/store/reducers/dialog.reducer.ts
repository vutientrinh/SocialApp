import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { parseCookies } from "nookies";

const name = "dialog";
export const resetState = createAction(`${name}/RESET_STATE`);

const initialState = {
  displayDetailPost: false,
  displayCreatePost: false,
  displayCreateFolder: false,
  displayAddPostToFolder: false,
  selectedPost: null,
  // profile for friend and user
  selectedProfile: null,
  isSelectedProfile: true, // Profile Login set to true
  profilePost: [],
  // report data for profile
  isSelectedItemProfile: false,
  ItemProfile: null,
  // number of posts
  numPosts: 0,
  // loadding when user create new post
  createNewPost: false,
  // loading when user voice chat in msg
  voiceLoading: false,
} as any;

const dialogSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setDialogState(state, action: PayloadAction<any>) {
      state.dialogState = action.payload;
    },
    setDisplayDetailPost(state, action: PayloadAction<boolean>) {
      state.displayDetailPost = action.payload;
      state.displayCreatePost = false;
    },
    setDisplayCreatePost(state, action: PayloadAction<boolean>) {
      state.displayCreatePost = action.payload;
      state.displayDetailPost = false;
    },
    setSelectedPost(state, action: PayloadAction<any>) {
      state.selectedPost = action.payload;
    },
    setSelectedProfile(state, action: PayloadAction<any>) {
      state.selectedProfile = action.payload;
    },
    setIsSelectedProfile(state, action: PayloadAction<boolean>) {
      state.isSelectedProfile = action.payload;
    },
    addCommentSelectedPost(state, action: PayloadAction<any>) {
      state.selectedPost.comments.push(action.payload);
    },
    setProfilePost(state, action: PayloadAction<any>) {
      state.profilePost = action.payload;
    },
    setDisplayCreateFolder(state, action: PayloadAction<boolean>) {
      state.displayCreateFolder = action.payload;
    },
    setDisplayAddPostToFolder(state, action: PayloadAction<boolean>) {
      state.displayAddPostToFolder = action.payload;
    },
    setSelectedItemProfile(state, action: PayloadAction<boolean>) {
      state.isSelectedItemProfile = action.payload;
    },
    setItemProfile(state, action: PayloadAction<any>) {
      state.ItemProfile = action.payload;
    },
    // set number of posts
    setNumPosts(state, action: PayloadAction<number>) {
      state.numPosts = action.payload;
    },
    // set create new post
    setCreateNewPost(state, action: PayloadAction<boolean>) {
      state.createNewPost = action.payload;
    },
    // set voice loading
    setVoiceLoading(state, action: PayloadAction<boolean>) {
      state.voiceLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const {
  setDialogState,
  setDisplayDetailPost,
  setDisplayCreatePost,
  setSelectedPost,
  setSelectedProfile,
  setIsSelectedProfile,
  setProfilePost,
  setDisplayCreateFolder,
  setDisplayAddPostToFolder,
  setSelectedItemProfile,
  setItemProfile,
  setNumPosts,
  setCreateNewPost,
  setVoiceLoading,
  addCommentSelectedPost,
} = dialogSlice.actions;

// Actions
export const actionToSetProfilePost = createAction(`${name}/SET_PROFILE_POST`);

// Selectors
export const selectDialogState = (state: any) => state.dialog.dialogState;
export const selectDisplayDetailPost = (state: any) =>
  state.dialog.displayDetailPost;
export const selectDisplayCreatePost = (state: any) =>
  state.dialog.displayCreatePost;
export const selectSelectedPost = (state: any) => state.dialog.selectedPost;
export const selectSelectedProfile = (state: any) =>
  state.dialog.selectedProfile;
export const selectIsSelectedProfile = (state: any) =>
  state.dialog.isSelectedProfile;
export const selectProfilePost = (state: any) => {
  const cookies = parseCookies();
  const uuid = cookies["uuid"];
  return state.dialog.profilePost.filter(
    (post: any) =>
      post.status === "PUBLIC" ||
      (post.status === "PRIVATE" && post.user.uuid === uuid)
  );
};
export const selectDisplayCreateFolder = (state: any) =>
  state.dialog.displayCreateFolder;
export const selectDisplayAddPostToFolder = (state: any) =>
  state.dialog.displayAddPostToFolder;
export const selectIsSelectedItemProfile = (state: any) =>
  state.dialog.isSelectedItemProfile;
export const selectItemProfile = (state: any) => state.dialog.ItemProfile;
export const selectNumPosts = (state: any) => state.dialog.numPosts;
export const selectCreateNewPost = (state: any) => state.dialog.createNewPost;
export const selectVoiceLoading = (state: any) => state.dialog.voiceLoading;
export default dialogSlice;
