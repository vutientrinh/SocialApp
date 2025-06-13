import { parseCookies } from "nookies";
import { call, put, select, takeEvery } from "typed-redux-saga";
import { commonStore, followStore } from "../reducers";

function* sagaGetFollowing() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];

  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/follow/get-all-following`;

    // Fetch the response
    const response = yield* call(fetch, URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is successful
    if (response.ok) {
      const result = yield* call([response, "json"]);
      yield* put(followStore.actions.setFollowing(result.data));
    } else {
      console.error("Failed to fetch following data", response.status);
    }
  } catch (error) {
    console.log("Error fetching following:", error);
  }
}

function* createFollowRequest(action: any) {
  const cookies = parseCookies();
  const following = action.payload;
  const follower = cookies["uuid"];
  const accessToken = cookies["accessToken"];

  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/follow/create?following=${following}&follower=${follower}`;

    // Fetch the response
    const response = yield* call(fetch, URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is successful
    if (response.ok) {
      const result = yield* call([response, "json"]); // Parse the response
      yield* put(
        commonStore.actions.setSuccessMessage(
          "Follow request sent successfully"
        )
      );
      yield* put(followStore.actions.removeUserFromNotFollowing(following));
      yield* select(followStore.sagaGetNotFollowing);
    } else {
      console.log("Failed to send follow request!");
    }
  } catch (error) {
    console.log("Failed to send follow request!");
  }
}

function* sagaGetNotFollowing() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];

  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/follow/get-all-not-following`;

    // Fetch the response
    const response = yield* call(fetch, URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is successful
    if (response.ok) {
      const result = yield* call([response, "json"]);
      yield* put(followStore.actions.setNotFollowing(result.data));
    } else {
      console.log("Failed to fetch not following data");
    }
  } catch (error) {
    console.log("Failed to fetch not following data");
  }
}

function* deleteFollowRequest(action: any) {
  const cookies = parseCookies();
  const following = action.payload;
  const follower = cookies["uuid"];
  const accessToken = cookies["accessToken"];

  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/follow/delete?following=${following}&follower=${follower}`;

    // Fetch the response
    const response = yield* call(fetch, URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is successful
    if (response.ok) {
      const result = yield* call([response, "json"]);
      yield* select(followStore.sagaGetFollowing);
      yield* put(followStore.actions.removeUserFromFollowing(following));
      yield* put(
        commonStore.actions.setSuccessMessage("Follow request deleted")
      );
    } else {
      console.log("Failed to delete request");
    }
  } catch (error) {
    console.log("Failed to delete request");
  }
}

function* sagaCountFollowing() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];

  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/follow/count-following`;

    // Fetch the response
    const response = yield* call(fetch, URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Check if the response is successful
    if (response.ok) {
      const result = yield* call([response, "json"]);
      const list: any[] = result.data;
      yield* put(followStore.actions.setNumFollowing(list[0]));
      yield* put(followStore.actions.setNumFollowers(list[1]));
    } else {
      console.log("Failed to fetch following data");
    }
  } catch (error) {
    console.log("Failed to fetch following data");
  }
}

function* followSaga() {
  yield* takeEvery(followStore.sagaGetFollowing, sagaGetFollowing);
  yield* takeEvery(followStore.sagaGetNotFollowing, sagaGetNotFollowing);
  yield* takeEvery(followStore.createFollowRequest, createFollowRequest);
  yield* takeEvery(followStore.deleteFollowRequest, deleteFollowRequest);
  yield* takeEvery(followStore.sagaCountFollowing, sagaCountFollowing);
}
export default followSaga;
