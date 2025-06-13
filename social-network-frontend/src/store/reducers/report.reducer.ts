import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "report";
export const resetState = createAction(`${name}/resetState`);
export const initialState = {
  profiles: [] as any[],
  male: 0,
  female: 0,
  dayCounts: [],
  actives: 0,
  inactives: 0,
  totalComments: 0,
  totalReactions: 0,
};

export const reportSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: {
    setProfiles: (state, action: PayloadAction<any>) => {
      state.profiles = action.payload;
    },
    setMale: (state, action: PayloadAction<number>) => {
      state.male = action.payload;
    },
    setFemale: (state, action: PayloadAction<number>) => {
      state.female = action.payload;
    },
    setDayCounts: (state, action: PayloadAction<any>) => {
      state.dayCounts = action.payload;
    },
    setActives: (state, action: PayloadAction<number>) => {
      state.actives = action.payload;
    },
    setInactives: (state, action: PayloadAction<number>) => {
      state.inactives = action.payload;
    },
    setTotalComments: (state, action: PayloadAction<number>) => {
      state.totalComments = action.payload;
    },
    setTotalReactions: (state, action: PayloadAction<number>) => {
      state.totalReactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const sagaGetList = createAction(`${name}/sagaGetList`);

//selectors
export const selectReport = (state: RootReducerType) => state.report;
export const selectProfiles = createSelector(
  selectReport,
  (state) => state.profiles
);
export const selectMale = createSelector(selectReport, (state) => state.male);
export const selectFemale = createSelector(
  selectReport,
  (state) => state.female
);
export const selectDayCounts = createSelector(
  selectReport,
  (state) => state.dayCounts
);

export const selectActives = createSelector(
  selectReport,
  (state) => state.actives
);

export const selectInactives = createSelector(
  selectReport,
  (state) => state.inactives
);
export const selectTotalUsers = createSelector(
  selectReport,
  (state) => state.profiles.length
);

export const selectTotalReactions = createSelector(
  selectReport,
  (state) => state.totalReactions
);
export const selectTotalComments = createSelector(
  selectReport,
  (state) => state.totalComments
);

export const { actions } = reportSlice;
export default reportSlice;
