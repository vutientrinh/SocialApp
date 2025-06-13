import { takeEvery } from "redux-saga/effects";
import { reportStore } from "../reducers";
import { parseCookies } from "nookies";
import { call, put } from "typed-redux-saga";
import { fFillEmptyDate } from "../../utils/formatTime";

function* fetchingReportData() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  // fetch user, profiles counts
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/report/all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(reportStore.actions.setProfiles(result.data.profiles));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  // fetch actives, inactives counts
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/report/actives`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(reportStore.actions.setActives(result.data.active));
    yield* put(reportStore.actions.setInactives(result.data.inactive));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  // fetch reaction counts and comment counts
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/report/interactions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(
      reportStore.actions.setTotalReactions(result.data.totalReactions)
    );
    yield* put(reportStore.actions.setTotalComments(result.data.totalComments));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  // fetch gender counts
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/report/gender`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(reportStore.actions.setMale(result.data.male));
    yield* put(reportStore.actions.setFemale(result.data.female));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  // fetch day counts
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/report/posts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(
      reportStore.actions.setDayCounts(fFillEmptyDate(result.data.dayCounts))
    );
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function* reportSaga() {
  yield takeEvery(reportStore.sagaGetList, fetchingReportData);
}
export default reportSaga;
