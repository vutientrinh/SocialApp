import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export interface ProfileLogin {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  createdAt: any;
  phoneNumber: string;
  dateOfBirth: any;
  bio: string;
  gender: string;
  avatar: string;
  createdBy: any;
}
export interface CreateProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: any;
  bio: string;
  gender: string;
  avatar: string;
}

export interface ProfileState {
  profileLogin: ProfileLogin;
  cacheProfiles: any[];
  profileCreate: CreateProfile;
}

export const name = "profile";
export const resetState = createAction(`${name}/RESET_STATE`);
export const initialState: ProfileState = {
  cacheProfiles: [],
  profileLogin: {
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    createdAt: null,
    phoneNumber: "",
    dateOfBirth: null,
    bio: "",
    gender: "",
    avatar: "",
    createdBy: {
      friends: [],
      username: "",
    },
  },
  profileCreate: {
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: null,
    bio: "",
    gender: "",
    avatar: "",
  },
};

const profileSlice = createSlice({
  name,
  initialState,
  reducers: {
    setProfile: (state, { payload }: PayloadAction<ProfileLogin>) => {
      state.profileLogin = payload;
    },
    setCacheProfiles: (state, { payload }: PayloadAction<any[]>) => {
      state.cacheProfiles = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const sagaGetProfile = createAction(`${name}/GET_PROFILE`);
export const getProfileByUser = createAction(`${name}/GET_PROFILE_BY_USER`);
export const cacheProfiles = createAction(`${name}/CACHE_PROFILES`);

// Selectors
export const selectState = (state: RootReducerType) => state[name];
export const selectProfile = createSelector(selectState, (state) => state);
export const selectProfileLogin = createSelector(
  selectState,
  (state) => state.profileLogin
);
export const selectCacheProfiles = createSelector(
  selectState,
  (state) => state.cacheProfiles
);

// get user by uuid
export const getProfileByUUID = (uuid: string) =>
  createSelector(selectCacheProfiles, (cacheProfiles) =>
    cacheProfiles.find((profile) => profile.createdBy.uuid === uuid)
  );

// get user by username
export const getProfileByUsername = (username: string) =>
  createSelector(selectCacheProfiles, (cacheProfiles) =>
    cacheProfiles.find((profile) => profile.createdBy.username === username)
  );

// Export actions and reducer
export const { actions } = profileSlice;
export const { setProfile } = profileSlice.actions;
export default profileSlice;
