import { takeEvery } from "redux-saga/effects";
import { all, call, put } from "typed-redux-saga";
import { profileStore } from "../reducers";
import userApi from "../../api/user.api";
import { parseCookies } from "nookies";

function* fetchProfiles() {}
function* getProfileByUser() {
  const response = yield* call(userApi.getProfileByUser);
  const result = JSON.parse(response.data).data;
  yield* put(profileStore.actions.setProfile(result));
}

function* cacheProfiles() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/profile/get-all-profiles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = yield* call([response, "json"]);
    yield* put(profileStore.actions.setCacheProfiles(data?.data));
  } catch (error) {
    console.log(error);
  }
}

function* profileSaga() {
  yield takeEvery(profileStore.sagaGetProfile, fetchProfiles);
  yield takeEvery(profileStore.getProfileByUser, getProfileByUser);
  yield takeEvery(profileStore.cacheProfiles, cacheProfiles);
}

export default profileSaga;
