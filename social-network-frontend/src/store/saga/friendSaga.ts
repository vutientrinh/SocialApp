import { takeEvery } from "typed-redux-saga";
import { commonStore, friendStore } from "../reducers";
import { parseCookies } from "nookies";
import { call, put, select } from "typed-redux-saga";

function* fetchData(url: any, accessToken: any) {
  const response = yield* call(fetch, url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return yield* call([response, "json"]);
}

function* sagaGetList() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];

  try {
    // Fetch friend list
    const friendURL = `${process.env.REACT_APP_BACKEND_URL}api/friend?userUUID=${uuid}`;
    const friendData = yield* call(fetchData, friendURL, accessToken);
    yield* put(friendStore.actions.setFriends(friendData?.data));

    // Fetch friend requests
    const friendRequestURL = `${process.env.REACT_APP_BACKEND_URL}api/friend-request/get-list-request`;
    const friendRequestData = yield* call(
      fetchData,
      friendRequestURL,
      accessToken
    );
    yield* put(friendStore.actions.setFriendRequest(friendRequestData?.data));

    // Fetch friend suggestions
    const friendSuggestionURL = `${process.env.REACT_APP_BACKEND_URL}api/profile/get-list-profile-not-friend`;
    const friendSuggestionData = yield* call(
      fetchData,
      friendSuggestionURL,
      accessToken
    );
    yield* put(
      friendStore.actions.setFriendSuggestion(friendSuggestionData?.data)
    );
  } catch (error) {
    console.error("Error fetching friend data:", error);
  }
}

function* friendSaga() {
  yield takeEvery(friendStore.sagaGetList, sagaGetList);
}

export default friendSaga;
