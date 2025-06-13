import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "chat";
export const resetState = createAction(`${name}/RESET_STATE`);

export const initialState = {
  chats: null as ChatResponse | null,
};

export interface ChatResponse {
  senderUUID: string;
  receiverUUID: string;
  threads: Thread[];
  lastUploadedAt: string;
}
export interface Thread {
  senderUUID: string;
  content: ContentInfor;
  timeStamps: string;
}
export interface ContentInfor {
  message: string;
}
const userSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setChatList: (state, { payload }: PayloadAction<ChatResponse | null>) => {
      state.chats = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const sagaGetList = createAction<{
  senderUUID: string;
  receiverUUID: string;
}>(`${name}/GET_LIST`);
export const selectState = (state: RootReducerType) => state[name];
export const selectChatList = createSelector(
  selectState,
  (state) => state.chats
);
export const { actions } = userSlice;
export default userSlice;
