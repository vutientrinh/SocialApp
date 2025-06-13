import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "reaction";
export const resetState = createAction(`${name}/RESET_STATE`);

export interface ReactionState {
  posts: {
    [uuid: string]: {
      reactionCount: {
        countAngry: number;
        countWow: number;
        countSad: number;
        countLike: number;
        countHaha: number;
        countLove: number;
      };
      reactionType?: string;
      isReact: boolean;
    };
  };
}

export const initialState: ReactionState = {
  posts: {},
};

export const reactionSlice = createSlice({
  name,
  initialState,
  reducers: {
    setCurrentReaction: (state, action: PayloadAction<any[]>) => {
      action.payload.forEach((post) => {
        if (!state.posts[post.uuid]) {
          state.posts[post.uuid] = {
            reactionCount: {
              countAngry: 0,
              countWow: 0,
              countSad: 0,
              countLike: 0,
              countHaha: 0,
              countLove: 0,
            },
            isReact: false,
          };
        }
        state.posts[post.uuid] = { ...state.posts[post.uuid], ...post };
      });
    },
    setReactionCount: (state, action: PayloadAction<any>) => {
      const postUUID = action.payload.uuid;
      if (state.posts[postUUID]) {
        // Ensure reactionCount is set correctly
        state.posts[postUUID].reactionCount = {
          countAngry: action.payload.reactionCount.countAngry || 0,
          countWow: action.payload.reactionCount.countWow || 0,
          countSad: action.payload.reactionCount.countSad || 0,
          countLike: action.payload.reactionCount.countLike || 0,
          countHaha: action.payload.reactionCount.countHaha || 0,
          countLove: action.payload.reactionCount.countLove || 0,
        };
      }
    },
    setUserReaction: (
      state,
      action: PayloadAction<{
        uuid: string;
        reactionType: string;
        isReact: boolean;
      }>
    ) => {
      const { uuid, reactionType, isReact } = action.payload;
      if (state.posts[uuid]) {
        state.posts[uuid].reactionType = reactionType;
        state.posts[uuid].isReact = isReact;
      }
    },
    setSelectedReaction: (
      state,
      action: PayloadAction<{ postId: string; reactionType: string }>
    ) => {
      const { postId, reactionType } = action.payload;
      if (state.posts[postId]) {
        state.posts[postId].reactionType = reactionType;
        state.posts[postId].isReact = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => initialState);
  },
});

export const getReactionCount = createAction(`${name}/GET_REACTION_COUNT`);

export const selectState = (state: RootReducerType) => state[name];

export const selectPosts = createSelector(selectState, (state) => state.posts);

export const { actions } = reactionSlice;
export default reactionSlice;
