import { put, takeEvery, call, select } from "typed-redux-saga";
import { commentStore, commonStore, dialogStore, postStore } from "../reducers";
import { parseCookies } from "nookies";

function* createComment(payload: any) {
  const postId = payload.payload;
  const newComment = yield* select(commentStore.selectNewComment);
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    // Call API to create new comment
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/comment/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newComment),
      }
    );
    const data = yield* call(() => response.json());
    yield* put(
      postStore.actions.appendCommentByPost({ postId, comment: data?.data })
    );
    yield* put(dialogStore.addCommentSelectedPost(data?.data));
    yield* put(
      commonStore.actions.setSuccessMessage("Comment created successfully")
    );
  } catch (error) {
    yield* put(
      commonStore.actions.setErrorMessage("Failed to create new comment")
    );
  }
}

function* commentSaga() {
  yield takeEvery(commentStore.createComment, createComment);
}
export default commentSaga;
