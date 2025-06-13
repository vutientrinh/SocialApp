import { call, takeEvery, put } from "typed-redux-saga";
import { commonStore, folderStore } from "../reducers";
import { parseCookies } from "nookies";

function* sagaGetFolders() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/folder/userFolders`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(folderStore.actions.setFolders(result.data || []));
    // check status is 404 not found
    if (response.status === 404) {
      yield* createDefaultFolder();
      return;
    }
  } catch (error) {
    console.error("Failed to fetch folders:", error);
  }
}

function* createDefaultFolder() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/folder/createDefault`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(folderStore.actions.addNewFolder(result.data));
    yield* put(folderStore.actions.setSelectedFolder(result.data));
  } catch (error) {
    console.error("Failed to create default folder:", error);
  }
}

function* createNewFolder(nameFolder: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/folder/create?folderName=${nameFolder.payload}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(folderStore.actions.addNewFolder(result.data));
  } catch (error) {
    console.error("Failed to create new folder:", error);
  }
}

function* deleteFolder(nameFolder: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/folder/delete?folderName=${nameFolder.payload}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    yield* put(folderStore.actions.deleteFolder(nameFolder.payload));
  } catch (error) {
    console.error("Failed to delete folder:", error);
  }
}

function* addPostToFolder({ payload: { nameFolder, postId } }: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/folder/${nameFolder}/addPost?postUUID=${postId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // check status is 200 ok
    if (response.status === 200) {
      yield* put(
        commonStore.actions.setSuccessMessage(
          'Post added to folder "' + nameFolder + '"'
        )
      );
    }
    // check status is 400 bad request
    if (response.status === 400) {
      yield* put(
        commonStore.actions.setErrorMessage(
          'Post saved fail in folder "' + nameFolder + '"'
        )
      );
    }
    // call fetch folders
    yield* put(folderStore.sagaGetFolders());
  } catch (error) {
    console.error("Failed to add post to folder:", error);
    yield* put(
      commonStore.actions.setErrorMessage(
        'Failed to add post to folder "' + nameFolder + '"'
      )
    );
  }
}

function* removePostToFolder({ payload: { nameFolder, postId } }: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/folder/removePost?postUUID=${postId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      yield* put(
        commonStore.actions.setSuccessMessage(
          'Post removed from folder "' + nameFolder + '"'
        )
      );
    }
    // call fetch folders
    yield* put(folderStore.sagaGetFolders());
  } catch (error) {
    console.error("Failed to remove post to folder:", error);
    yield* put(
      commonStore.actions.setErrorMessage(
        'Failed to remove post from folder "' + nameFolder + '"'
      )
    );
  }
}

function* folderSaga() {
  yield* takeEvery(folderStore.sagaGetFolders, sagaGetFolders);
  yield* takeEvery(folderStore.sagaCreateNewFolder, createNewFolder);
  yield* takeEvery(folderStore.sagaDeleteFolder, deleteFolder);
  yield* takeEvery(folderStore.sagaAddPostToFolder, addPostToFolder);
  yield* takeEvery(folderStore.sagaRemovePostToFolder, removePostToFolder);
}
export default folderSaga;
