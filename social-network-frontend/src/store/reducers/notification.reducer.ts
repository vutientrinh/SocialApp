import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "notification";
export const resetState = createAction(`${name}/RESET_STATE`);

export const initialState = {
  notifications: [] as any[],
};

const notificationSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setNotificationList: (state, { payload }: PayloadAction<any[]>) => {
      state.notifications = payload;
    },
    addNotification: (state, { payload }: PayloadAction<any>) => {
      state.notifications.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const sagaGetList = createAction(`${name}/GET_LIST`);
export const sagaMarkAsRead = createAction(`${name}/MARK_AS_READ`);
//selectors
export const selectState = (state: RootReducerType) => state[name];
export const selectNotificationList = createSelector(
  selectState,
  (state) => state.notifications
);

export const { actions } = notificationSlice;
export default notificationSlice;
