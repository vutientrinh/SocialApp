import { commonStore, imagesStore } from "../reducers";
import { call, put, select } from "typed-redux-saga";
import { takeEvery } from "redux-saga/effects";
import { parseCookies } from "nookies";
import { PayloadAction } from "@reduxjs/toolkit";

export interface ImageUpload {
  uuid: string;
  url: string;
  name: string;
}

export interface UploadResponse {
  success: boolean;
  data: any;
}

async function fetchFileFromBlob(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const name = `image-${Date.now()}.jpg`;
  return new File([blob], name, { type: blob.type });
}

function* uploadImagesToCloud() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const images: string[] = yield* select(imagesStore.selectImageList);

  try {
    for (const blobUrl of images) {
      const file: File = yield call(fetchFileFromBlob, blobUrl);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);

      const response: any = yield* call(
        fetch,
        `${process.env.REACT_APP_BACKEND_URL}api/image/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data: UploadResponse = yield response.json();
      yield* put(imagesStore.actions.addImapeUpload(data));
    }

    // Mark upload as complete
    yield* put(imagesStore.actions.setCompleteUpload(true));
    yield* put(
      commonStore.actions.setSuccessMessage("Images uploaded successfully")
    );
  } catch (error) {
    console.error("Error uploading images:", error);
  }
}

function* fetchImagesByUser(payload: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const profile = payload.payload;
  const url = `${process.env.REACT_APP_BACKEND_URL}api/image/get-all-image-by-user?currentUser=${profile.createdBy.uuid}`;
  try {
    // Perform the fetch call
    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Parse the JSON data
    const data: { images: any[] } = yield call([response, "json"]);
    yield put(imagesStore.actions.setImageStore(data.images));
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

function* uploadAvatarToCloud(action: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];

  // Fetch the file from the blob URL
  const blobUrl = action.payload;
  const file: File = yield call(fetchFileFromBlob, blobUrl);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    // Perform the API request
    const response: Response = yield call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/image/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload avatar");
    }

    const data = yield* call([response, "json"]);
    if (data.url != null) {
      yield* put(
        commonStore.actions.setSuccessMessage("Avatar uploaded successfully")
      );
      yield put(imagesStore.actions.setImageAvatar(data.url));
    } else {
      yield put(commonStore.actions.setErrorMessage("Failed to upload avatar"));
    }
  } catch (error) {
    console.error("Error uploading avatar:", error);
    yield put(commonStore.actions.setErrorMessage("Failed to upload avatar"));
  }
}

function* fetchMediaResources() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const url = `${process.env.REACT_APP_BACKEND_URL}api/file/get-all-file`;

  try {
    // Perform the fetch call
    const response: Response = yield call(fetch, url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = yield* call([response, "json"]);
    yield put(imagesStore.actions.setMediaResources(data.data));
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

function* removeFromCloud(action: any) {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const { imageUUID, profile } = action.payload;

  try {
    const URL =
      `${process.env.REACT_APP_BACKEND_URL}api/image/delete?imageUUID=` +
      imageUUID;
    const response: any = yield* call(fetch, URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    if (response.status === 200) {
      yield* put(
        commonStore.actions.setSuccessMessage("Images deleted successfully")
      );
      // fetch images again
      yield* put(imagesStore.fetchImageByUser(profile));
    }
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to delete image"));
    console.error("Error uploading images:", error);
  }
}

function* imageSaga() {
  yield takeEvery(imagesStore.uploadImagesToCloud, uploadImagesToCloud);
  yield takeEvery(imagesStore.fetchImageByUser, fetchImagesByUser);
  yield takeEvery(imagesStore.uploadAvatarToCloud, uploadAvatarToCloud);
  yield takeEvery(imagesStore.fetchMediaResources, fetchMediaResources);
  yield takeEvery(imagesStore.removeFromCloud, removeFromCloud);
}

export default imageSaga;
