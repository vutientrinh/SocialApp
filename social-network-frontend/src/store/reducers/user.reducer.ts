import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "user";
export const resetState = createAction(`${name}/RESET_STATE`);

export const initialState = {
  users: [] as any[],
  selectedReceiverUUID: null as {
    online: boolean;
    uuid: string;
    username: string;
    avatar: string;
  } | null,
};

const userSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setUserList: (state, { payload }: PayloadAction<any[]>) => {
      state.users = payload;
    },
    setSelectedReceiver: (
      state,
      {
        payload,
      }: PayloadAction<{
        online: boolean;
        uuid: string;
        username: string;
        avatar: string;
      }>
    ) => {
      // Set the selected user UUID
      state.selectedReceiverUUID = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const sagaGetList = createAction(`${name}/GET_LIST`);
export const sagaSelectedReceiverUUID = createAction<{
  online: boolean;
  receiverUUID: string;
  username: string;
  avatar: string;
}>(`${name}/GET_USER`);

// admin actions
export const sagaEditUser = createAction(
  `${name}/CREATE_NEW_USER`,
  (newProfile: any, userUUID: any) => ({
    payload: { newProfile, userUUID },
  })
);

// change status of user
export const sagaChangeStatus = createAction(
  `${name}/CHANGE_STATUS`,
  (userId: string) => ({
    payload: { userId },
  })
);

//selectors
export const selectState = (state: RootReducerType) => state[name];
export const selectUserList = createSelector(
  selectState,
  (state) => state.users
);

export const selectSelectedUserUUID = createSelector(
  selectState,
  (state) => state.selectedReceiverUUID
);

export const { actions } = userSlice;
export default userSlice;
