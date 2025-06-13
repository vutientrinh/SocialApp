import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "follow";
export const resetState = createAction(`${name}/resetState`);
export const initialState = {
  following: [] as any[],
  notFollowing: [] as any[],
  numFollowing: 0,
  numFollowers: 0,
};

const followSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setFollowing: (state, action: PayloadAction<any>) => {
      state.following = action.payload;
    },
    setNumFollowing: (state, action: PayloadAction<number>) => {
      state.numFollowing = action.payload;
    },
    setNumFollowers: (state, action: PayloadAction<number>) => {
      state.numFollowers = action.payload;
    },
    setNotFollowing: (state, action: PayloadAction<any>) => {
      state.notFollowing = action.payload;
    },
    removeUserFromNotFollowing: (state, action: PayloadAction<any>) => {
      state.notFollowing = state.notFollowing.filter(
        (user) => user.createdBy.uuid !== action.payload
      );
    },
    removeUserFromFollowing: (state, action: PayloadAction<any>) => {
      state.following = state.following.filter(
        (user) => user.createdBy.uuid !== action.payload
      );
    },
  },
});
export const { actions } = followSlice;

export const sagaGetFollowing = createAction(`${name}/sagaGetFollowing`);
export const sagaGetNotFollowing = createAction(`${name}/sagaGetNotFollowing`);
export const createFollowRequest = createAction(
  `${name}/createFollowRequest`,
  (following: any) => ({ payload: following })
);
export const deleteFollowRequest = createAction(
  `${name}/deleteFollowRequest`,
  (following: any) => ({ payload: following })
);
export const sagaCountFollowing = createAction(`${name}/sagaCountFollowing`);

//selectors
export const selectFollowing = createSelector(
  (state: RootReducerType) => state.follow.following,
  (following) => following
);
export const selectNonFollowing = createSelector(
  (state: RootReducerType) => state.follow.notFollowing,
  (notFollowing) => notFollowing
);
export const selectNumFollowing = createSelector(
  (state: RootReducerType) => state.follow.numFollowing,
  (numFollowing) => numFollowing
);
export const selectNumFollowers = createSelector(
  (state: RootReducerType) => state.follow.numFollowers,
  (numFollowers) => numFollowers
);
export default followSlice;
