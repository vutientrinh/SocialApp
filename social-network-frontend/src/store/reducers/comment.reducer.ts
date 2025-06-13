import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "comment";
export const resetState = createAction(`${name}/RESET_STATE`);

export const initialState = {
  comments: [] as any[],
  newComment: {
    postUUID: "",
    content: {
      message: "",
      fileUUID: null,
      imageURLs: null,
    },
  },
};

const commentSlice = createSlice({
  name,
  initialState,
  reducers: {
    setNewComment(state, action: PayloadAction<any>) {
      state.newComment = action.payload;
    },
    addComment(state, action: PayloadAction<any>) {
      state.comments.push(action.payload);
    },
    setMessageNewComment(state, action: PayloadAction<string>) {
      state.newComment.content.message = action.payload;
    },
    setPostUUID(state, action: PayloadAction<string>) {
      state.newComment.postUUID = action.payload;
    },
  },
});

export const createComment = createAction(
  `${name}/sagaCreateComment`,
  (postId: any) => ({ payload: postId })
);

// selectors
export const selectCommentsState = (state: RootReducerType) => state.comment;
export const selectNewComment = (state: RootReducerType) =>
  state.comment.newComment;
export const selectComments = (state: RootReducerType) =>
  state.comment.comments;
export const { actions } = commentSlice;
export default commentSlice;
