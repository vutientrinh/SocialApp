import { fork } from "redux-saga/effects";
import chatSaga from "./chatSaga";
import notificationSaga from "./notificationSaga";
import userSaga from "./userSaga";
import profileSaga from "./profileSaga";
import postSaga from "./postSaga";
import imageSaga from "./imageSaga";
import commentSaga from "./commentSaga";
import reactionSaga from "./reactionSaga";
import friendSaga from "./friendSaga";
import folderSaga from "./folderSaga";
import reportSaga from "./reportSaga";
import followSaga from "./followSaga";

function* rootSaga() {
  yield fork(userSaga);
  yield fork(chatSaga);
  yield fork(notificationSaga);
  yield fork(profileSaga);
  yield fork(postSaga);
  yield fork(imageSaga);
  yield fork(commentSaga);
  yield fork(reactionSaga);
  yield fork(friendSaga);
  yield fork(folderSaga);
  yield fork(reportSaga);
  yield fork(followSaga);
}

export default rootSaga;
