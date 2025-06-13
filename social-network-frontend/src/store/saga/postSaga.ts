import {
  TSagaGetFriendPosts,
  updateStatusPost,
} from "./../reducers/post.reducer";
import { parseCookies } from "nookies";
import { takeEvery } from "redux-saga/effects";
import { call, put, select } from "typed-redux-saga";
import postApi from "../../api/post.api";
import { commonStore, dialogStore, postStore } from "../reducers";
import { PostList } from "../reducers/post.reducer";

function* fetchPosts() {
  try {
    // Fetch all posts by all users
    const response = yield* call(postApi.getPostList, {
      page: 1,
      size: 3,
      orderedBy: "createdDateAt",
      isAscending: false,
      keyword: "",
    });
    const result: PostList[] = JSON.parse(response.data).data.posts;
    yield* put(postStore.actions.setPosts(result));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function* TSagaGetPosts(paginate: any) {
  const { page, size } = paginate.payload;
  try {
    // Fetch all posts by all users
    const response = yield* call(postApi.getPostList, {
      page: page,
      size: size,
      orderedBy: "createdDateAt",
      isAscending: false,
      keyword: "",
    });
    const result: PostList[] = JSON.parse(response.data).data.posts;
    if (page === 1) {
      yield* put(postStore.actions.setPosts(result));
    } else {
      yield* put(postStore.actions.appendPosts(result));
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function* fetchProfilePosts() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const selectedProfile = yield* select(dialogStore.selectSelectedProfile);
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/post/get-all-post-by-user?uuid=${selectedProfile?.createdBy.uuid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = yield* call(() => response.json());
    yield* put(dialogStore.setProfilePost(result.data.posts));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function* createNewPost() {
  const newPost = yield* select(postStore.selectNewPost);
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const response = yield* call(
      fetch,
      `${process.env.REACT_APP_BACKEND_URL}api/post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newPost),
      }
    );
    // redirect to home page
    window.location.href = "/";
    if (response.status === 200) {
      yield* put(dialogStore.setCreateNewPost(false));
      yield* put(
        commonStore.actions.setSuccessMessage("Post created successfully")
      );
    } else {
      yield* put(
        commonStore.actions.setErrorMessage(
          "The system is overloaded, please try again in a few minutes."
        )
      );
    }
  } catch (error) {
    yield* put(
      commonStore.actions.setErrorMessage(
        "The system is overloaded, please try again in a few minutes."
      )
    );
  }
}

function* fetchProfileFriendPosts(paginate: any) {
  const { page, size } = paginate.payload;
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];
  try {
    // Fetch all posts by all users
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/post/get-all-post-by-friend?size=${size}&page=${page}&orderedBy=createdDateAt&isAscending=false&uuid=${uuid}`;
    const response = yield* call(fetch, URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = yield* call(() => response.json());
    if (page === 1) {
      yield* put(postStore.actions.setFriendPosts(result.data.posts));
    } else {
      yield* put(postStore.actions.appendFriendPosts(result.data.posts));
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}
function* fetchProfileFollowPosts(paginate: any) {
  const { page, size } = paginate.payload;
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  const uuid = cookies["uuid"];
  try {
    // Fetch all posts by all users
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/post/get-all-post-by-follow?size=${size}&page=${page}&orderedBy=createdDateAt&isAscending=false&uuid=${uuid}`;
    const response = yield* call(fetch, URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = yield* call(() => response.json());
    if (page === 1) {
      yield* put(postStore.actions.setFollowPosts(result.data.posts));
    } else {
      yield* put(postStore.actions.appendFollowPosts(result.data.posts));
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function* sagaSetNumPosts() {
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/post/count-posts-user`;
    const response = yield* call(fetch, URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = yield* call(() => response.json());
    const count = result.data;
    yield* put(dialogStore.setNumPosts(count));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
}

function* sagaUpdateStatusPost(postInfo: any) {
  const { postId, status } = postInfo.payload;
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/post/${postId}?status=${status}`;
    const response = yield* call(fetch, URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 200) {
      yield* put(postStore.actions.updateStatusPost(postInfo.payload));
      yield* put(
        commonStore.actions.setSuccessMessage("Hidden post successfully")
      );
    } else
      yield* put(commonStore.actions.setErrorMessage("Hidden post failed"));
  } catch (error) {
    console.error("Failed to change status post:", error);
  }
}

function* postSaga() {
  yield takeEvery(postStore.sagaGetPosts, fetchPosts);
  yield takeEvery(postStore.TSagaGetPosts, TSagaGetPosts);
  yield takeEvery(postStore.createNewPost, createNewPost);
  yield takeEvery(dialogStore.actionToSetProfilePost, fetchProfilePosts); // if call then get new profile post
  yield takeEvery(postStore.TSagaGetFriendPosts, fetchProfileFriendPosts);
  yield takeEvery(postStore.TSagaGetFollowPosts, fetchProfileFollowPosts);
  yield takeEvery(postStore.sagaSetNumPosts, sagaSetNumPosts);
  yield takeEvery(postStore.updateStatusPost, sagaUpdateStatusPost);
}

export default postSaga;
