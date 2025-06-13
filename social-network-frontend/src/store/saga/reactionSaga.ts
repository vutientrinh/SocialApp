import { takeEvery } from "typed-redux-saga";
import { reactionStore } from "../reducers";
import { call, put, select } from "typed-redux-saga";
import { parseCookies } from "nookies";

function* selectReaction() {
  const posts = yield* select(reactionStore.selectPosts);
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];

  for (const uuid in posts) {
    const reactionCountUrl = `${process.env.REACT_APP_BACKEND_URL}api/reaction/count?postUUID=${uuid}`;
    const userReactionUrl = `${process.env.REACT_APP_BACKEND_URL}api/reaction/check?postUUID=${uuid}`;

    try {
      // Fetch reaction counts
      const reactionCountResponse = yield* call(fetch, reactionCountUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const reactionCountData = yield* call([reactionCountResponse, "json"]);
      // Update reaction count for the post
      yield* put(
        reactionStore.actions.setReactionCount({
          uuid,
          reactionCount: reactionCountData.data,
        })
      );

      // Fetch user's specific reaction type
      const userReactionResponse = yield* call(fetch, userReactionUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userReactionData = yield* call([userReactionResponse, "json"]);
      yield* put(
        reactionStore.actions.setUserReaction({
          uuid,
          reactionType: userReactionData.data?.reactionType,
          isReact: userReactionData.data?.isReact,
        })
      );
    } catch (error) {
      console.log(`Error fetching reaction data for post ${uuid}:`, error);
    }
  }
}

function* reactionSaga() {
  yield takeEvery(reactionStore.getReactionCount, selectReaction);
}

export default reactionSaga;
