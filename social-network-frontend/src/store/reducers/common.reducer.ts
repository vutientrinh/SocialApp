import { AlertColor } from "@mui/material";
import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

const name = "common";
export const resetState = createAction(`${name}/RESET_STATE`);

const initialState = {
  messageState: {
    message: "",
    status: "success" as AlertColor,
    display: false,
  },
  tableState: {
    size: 100,
    pageNumber: 0,
    totalPage: 1,
    totalElement: 4,
    numberOfElement: 4,
  } as any,
};

const commonSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    // set error message
    setErrorMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "error";
      state.messageState.display = true;
    },
    // set warning message
    setWarningMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "warning";
      state.messageState.display = true;
    },
    // set success message
    setSuccessMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "success";
      state.messageState.display = true;
    },
    // set notification message
    setNotificationMessage(state, action: PayloadAction<string>) {
      state.messageState.message = action.payload;
      state.messageState.status = "info";
      state.messageState.display = true;
    },
    // set display message
    setDisplaymessage(state, action: PayloadAction<boolean>) {
      state.messageState.display = action.payload;
    },
    // set table state
    setTableState(state, action: PayloadAction<any>) {
      state.tableState = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

// selectors
export const selectState = (state: any) => state[name];
export const selectMessageState = createSelector(
  selectState,
  (state) => state.messageState
);
export const selectTableState = createSelector(
  selectState,
  (state) => state.tableState
);

export const { actions } = commonSlice;
export default commonSlice;
