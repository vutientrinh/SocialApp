import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "image";
export const resetState = createAction(`${name}/RESET_STATE`);

export const initialState = {
  images: [] as any[],
  imagesUpload: [] as any[],
  completeUpload: false,
  imageStore: [] as any[], // All images of current user
  imageAvatar: null as any,
  mediaResources: [] as any[],
};

const imageSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setImageList: (state, { payload }: PayloadAction<any[]>) => {
      state.images = payload;
      state.completeUpload = false;
    },
    setImagesUpload: (state, { payload }: PayloadAction<any[]>) => {
      state.imagesUpload = payload;
    },
    addImapeUpload: (state, { payload }: PayloadAction<any>) => {
      state.imagesUpload.push(payload);
    },
    addImage: (state, { payload }: PayloadAction<any>) => {
      state.images.push(payload);
    },
    removeItem: (state, { payload }: PayloadAction<any>) => {
      state.images = state.images.filter((item) => item !== payload);
    },
    setCompleteUpload: (state, { payload }: PayloadAction<boolean>) => {
      state.completeUpload = payload;
    },
    setImageStore: (state, { payload }: PayloadAction<any[]>) => {
      state.imageStore = payload;
    },
    setImageAvatar: (state, { payload }: PayloadAction<any>) => {
      state.imageAvatar = payload;
    },
    setMediaResources: (state, { payload }: PayloadAction<any[]>) => {
      state.mediaResources = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});

export const selectImageState = (state: RootReducerType) => state[name];
export const uploadImagesToCloud = createAction(
  `${name}/UPLOAD_IMAGES_TO_CLOUD`
);
// upload avatar to cloud
export const uploadAvatarToCloud = createAction(
  `${name}/UPLOAD_AVATAR_TO_CLOUD`,
  (file: string) => ({ payload: file })
);
export const selectImageAvatar = createSelector(
  selectImageState,
  (state) => state.imageAvatar
);

// fetch Media Resources
export const fetchMediaResources = createAction(
  `${name}/FETCH_MEDIA_RESOURCES`
);
export const removeFromCloud = createAction(
  `${name}/REMOVE_FROM_CLOUD`,
  (imageUUID: string, profile: any) => ({ payload: { imageUUID, profile } })
);

// fetch image by user
export const fetchImageByUser = createAction(
  `${name}/FETCH_IMAGE_BY_USER`,
  (profile: string) => ({ payload: profile })
);

// selectors
export const selectImageList = createSelector(
  selectImageState,
  (state) => state.images
);

export const selectImageUploadList = createSelector(
  selectImageState,
  (state) => state.imagesUpload
);

export const selectCompleteUpload = createSelector(
  selectImageState,
  (state) => state.completeUpload
);

export const selectImageStore = createSelector(
  selectImageState,
  (state) => state.imageStore
);

export const selectMediaResources = createSelector(
  selectImageState,
  (state) => state.mediaResources
);
export const { actions } = imageSlice;
export default imageSlice;
