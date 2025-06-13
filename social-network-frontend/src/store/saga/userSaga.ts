import { takeEvery } from "redux-saga/effects";
import { call, put } from "typed-redux-saga";
import userApi from "../../api/user.api";
import { commonStore, dialogStore, reportStore, userStore } from "../reducers";
import { parseCookies } from "nookies";

function* fetchUserListing() {
  try {
    const response = yield* call(userApi.getUserList, {
      page: 1,
      size: 100,
      orderedBy: "username",
      isAscending: true,
      keyword: "",
    });
    const users = JSON.parse(response.data).data.users;
    yield put(userStore.actions.setUserList(users));
  } catch (error) {
    console.error("Failed to fetch user list:", error);
  }
}

function* selectUser(
  action: ReturnType<typeof userStore.sagaSelectedReceiverUUID>
) {
  try {
    const { online, receiverUUID, username, avatar } = action.payload;
    yield put(
      userStore.actions.setSelectedReceiver({
        online: online,
        uuid: receiverUUID,
        username: username,
        avatar: avatar,
      })
    );
  } catch (error) {
    console.error("Failed to select user:", error);
  }
}

// admin actions
function* editUser(action: any) {
  const { newProfile, userUUID } = action.payload;
  const formUpdate = {
    firstName: newProfile.firstName,
    middleName: newProfile.middleName,
    lastName: newProfile.lastName,
    gender: newProfile.gender,
    dateOfBirth: newProfile.dateOfBirth,
    bio: newProfile.bio,
    phoneNumber: newProfile.phoneNumber,
    avatar: newProfile.avatar, //https://res.cloudinary.com/dtrb7dkmw/image/upload/g6brkng7wisefoavodyb
  };

  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    // URL
    const URL =
      `${process.env.REACT_APP_BACKEND_URL}api/profile/update-profile-by-uuid?uuid=` +
      userUUID;
    const response = fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formUpdate),
    });
    const data = yield* call(() => response.then((res) => res.json()));
    // If the user is authorized
    console.log(data);
    if (data.code === 200) {
      yield* put(
        commonStore.actions.setSuccessMessage("Profile updated successfully")
      );
      yield* put(dialogStore.setSelectedItemProfile(false));
    }

    // If the user is not authorized
    if (data.status === 401) {
      yield* put(
        commonStore.actions.setErrorMessage("failed to update profile")
      );
    }
  } catch (error) {
    yield* put(commonStore.actions.setErrorMessage("Failed to update profile"));
    console.error("Failed to create new user:", error);
  }
}

function* changeStatus(action: any) {
  const { userId } = action.payload;
  const cookies = parseCookies();
  const accessToken = cookies["accessToken"];
  try {
    // URL
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/user/` + userId;
    const response = fetch(URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = yield* call(() => response.then((res) => res.json()));
    console.log(data);
    if (data.code === 200) {
      yield* put(
        commonStore.actions.setSuccessMessage(
          "User status updated successfully"
        )
      );
      yield* put(reportStore.sagaGetList());
    }
    // If the user is not authorized
    if (data.status === 401) {
      yield* put(
        commonStore.actions.setErrorMessage("Failed to update user status")
      );
    }
  } catch (error) {
    yield* put(
      commonStore.actions.setErrorMessage("Failed to update user status")
    );
    console.error("Failed to update user status:", error);
  }
}

function* userSaga() {
  yield takeEvery(userStore.sagaGetList, fetchUserListing);
  yield takeEvery(userStore.sagaSelectedReceiverUUID, selectUser);
  yield takeEvery(userStore.sagaEditUser, editUser);
  yield takeEvery(userStore.sagaChangeStatus, changeStatus);
}

export default userSaga;
