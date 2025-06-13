import { takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga";
import chatApi from "../../api/chat.api";
import { chatStore } from "../reducers";
import { sagaGetList } from "../reducers/chat.reducer";

function* fetchUserChat(action: ReturnType<typeof sagaGetList>) {
  const { senderUUID, receiverUUID } = action.payload;
  try {
    const responseData = yield* call(
      chatApi.getChatList,
      senderUUID,
      receiverUUID
    );
    if (responseData.status === 200) {
      const message = JSON.parse(responseData.data);
      yield put(chatStore.actions.setChatList(message));
    } else console.error("Can get!!");
  } catch (error) {
    yield put(chatStore.actions.setChatList(null));
    console.error("Fail to get message", error);
  }
}

function* chatSaga() {
  yield takeEvery(sagaGetList.type, fetchUserChat);
}

export default chatSaga;
