import { takeEvery } from "redux-saga/effects";
import { all, call, put } from "typed-redux-saga";
import { commonStore, notificationStore } from "../reducers";
import notificationApi from "../../api/notification.api";
import { parseCookies } from "nookies";

function* fetchNotifications() {
  // Fetch notifications from the server
  // and dispatch the result to the store
  try {
    const response = yield* call(notificationApi.getNotificationList, {});
    const notifications = JSON.parse(response.data).data;
    yield put(notificationStore.actions.setNotificationList(notifications));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
}
function* markAsReadNotifications() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/msg/markAsRead`;
    const response = fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = yield* call(() => response.then((res) => res.json()));
    if (data.success) {
      yield put(
        commonStore.actions.setSuccessMessage(
          "Marked all notifications as read"
        )
      );
    }
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
}

function* notificationSaga() {
  yield takeEvery(notificationStore.sagaGetList, fetchNotifications);
  yield takeEvery(notificationStore.sagaMarkAsRead, markAsReadNotifications);
}

export default notificationSaga;
