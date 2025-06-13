import {
  createAction,
  createSelector,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootReducerType } from "./rootReducer";

export const name = "folder";
export const resetState = createAction(`${name}/RESET_STATE`);
export const initialState = {
  folders: [] as any,
  isSelectedFolder: null as any,
  savedPosts: JSON.parse(localStorage.getItem("savedPosts") || "{}") as Record<
    string,
    boolean
  >,
};

const folderSlice = createSlice({
  name,
  initialState: initialState,
  reducers: {
    setFolders: (state, action: PayloadAction<any>) => {
      state.folders = action.payload;
    },
    addNewFolder: (state, action: PayloadAction<any>) => {
      state.folders.push(action.payload);
    },
    deleteFolder: (state, action: PayloadAction<any>) => {
      // remove by nameFolder.payload from folders
      state.folders = state.folders.filter(
        (f: any) => f.name !== action.payload
      );
    },
    setSelectedFolder: (state, action: PayloadAction<any>) => {
      state.isSelectedFolder = action.payload;
    },
    setStatusSavedPost: (state, action: PayloadAction<any>) => {
      state.savedPosts[action.payload] = true;
      localStorage.setItem("savedPosts", JSON.stringify(state.savedPosts));
    },
    setStatusUnsavedPost: (state, action: PayloadAction<any>) => {
      state.savedPosts[action.payload] = false;
      localStorage.setItem("savedPosts", JSON.stringify(state.savedPosts));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetState, () => {
      return initialState;
    });
  },
});
export const sagaGetFolders = createAction(`${name}/GET_FOLDERS`);
export const sagaCreateNewFolder = createAction(
  `${name}/CREATE_NEW_FOLDER`,
  (nameFolder: any) => ({ payload: nameFolder })
);
export const sagaDeleteFolder = createAction(
  `${name}/DELETE_FOLDER`,
  (nameFolder: any) => ({ payload: nameFolder })
);
export const sagaAddPostToFolder = createAction(
  `${name}/ADD_POST_TO_FOLDER`,
  (nameFolder: any, postId: any) => ({ payload: { nameFolder, postId } })
);
export const sagaRemovePostToFolder = createAction(
  `${name}/REMOVE_POST_TO_FOLDER`,
  (nameFolder: any, postId: any) => ({ payload: { nameFolder, postId } })
);

export const selectFolders = createSelector(
  (state: RootReducerType) => state.folder,
  (folder) => {
    const folderMap = new Map();
    folder.folders.forEach((f: any) => folderMap.set(f.name, f));
    return Array.from(folderMap.values());
  }
);

export const getPostFromFolder = (folderId: string | null) =>
  createSelector(
    (state: RootReducerType) => state.folder.folders,
    (folders) => {
      const folder = folders.find((f: any) => f.uuid === folderId);
      return folder ? folder.posts : [];
    }
  );

export const getIsSelectedFolder = createSelector(
  (state: RootReducerType) => state.folder,
  (folder) => folder.isSelectedFolder
);

export const getFolderDeafult = createSelector(
  (state: RootReducerType) => state.folder,
  (folder) => folder.folders.find((f: any) => f.name === "Default")
);

export const getStatusSavedPost = (postId: string) =>
  createSelector(
    (state: RootReducerType) => state.folder.savedPosts,
    (savedPosts) => savedPosts[postId] || false
  );

export const { actions } = folderSlice;
export default folderSlice;
