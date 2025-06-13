import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "friend";
export const resetState = createAction(`${name}/RESET_STATE`);

export const initialState = {
  friends: [] as any[],
  friendRequest: [] as any[],
  FriendSuggestion: [] as any[],
};

const friendSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<any[]>) => {
      state.friends = action.payload;
    },
    setFriendRequest: (state, action: PayloadAction<any[]>) => {
      state.friendRequest = action.payload;
    },
    setFriendSuggestion: (state, action: PayloadAction<any[]>) => {
      state.FriendSuggestion = action.payload;
    },
    removeFriend: (state, action: PayloadAction<number>) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload
      );
    },
    removeFriendRequest: (state, action: PayloadAction<number>) => {
      state.friendRequest = state.friendRequest.filter(
        (request) => request.id !== action.payload
      );
    },
    removeFriendSuggestion: (state, action: PayloadAction<number>) => {
      state.FriendSuggestion = state.FriendSuggestion.filter(
        (suggestion) => suggestion.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const sagaGetList = createAction(`${name}/GET_LIST`);

//selectors
export const selectState = (state: RootReducerType) => state[name];
export const selectFriends = createSelector(selectState, (state) => {
  return state.friends;
});
export const selectFriendRequest = createSelector(selectState, (state) => {
  return state.friendRequest;
});

export const selectFriendSuggestion = createSelector(selectState, (state) => {
  return state.FriendSuggestion;
});

export const { actions } = friendSlice;
export const { setFriends, setFriendRequest } = friendSlice.actions;
export default friendSlice;
