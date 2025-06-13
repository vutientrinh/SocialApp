import { Box, CircularProgress } from "@mui/material";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import File from "../pages/Admin/File";
import MainPage from "../pages/MainPage";
import Loading from "../components/App/Loading/Loading";

/**  Delay Function **/
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Pages **/
const DashBoard = lazy(() => import("../pages/Admin/Dashboard"));
const User = lazy(() => import("../pages/Admin/User"));
const Login = lazy(() => import("../pages/LoginPage/Login"));
const UpdateProfile = lazy(() => import("../pages/RegisterPage/Profile"));
const Socket = lazy(() => import("../components/TestSocket"));
const TestChat = lazy(() => import("../components/TestChat"));
const Chat = lazy(() => import("../pages/Chat/ChatMessage"));
const Register = lazy(() => import("../pages/RegisterPage/Register"));
const Download = lazy(() => import("../components/TestDownload"));
const AdminPage = lazy(() => import("../pages/Admin"));
const FeedTable = lazy(() => import("../../src/pages/Feeds/index"));
const FriendPage = lazy(() => import("../../src/pages/Friends/index"));
const SaveItemPage = lazy(() => import("../../src/pages/SavedItems/index"));
const ResourcePage = lazy(() => import("../../src/pages/Resources/index"));
const FriendRequestPage = lazy(() =>
  import("../../src/pages/Friends/FriendRequest")
);
const FriendSuggestionPage = lazy(() =>
  import("../../src/pages/Friends/FriendSuggestion")
);
const ListFriend = lazy(() => import("../../src/pages/Friends/ListFriend"));
const ProfilePage = lazy(() => import("../../src/pages/Profile/ProfilePage"));
const FollowPage = lazy(() => import("../../src/pages/Follow/index"));
const FollowingList = lazy(() => import("../../src/pages/FollowList/index"));
const NotFoundPage = lazy(() => import("../pages/404"));
const FollowFeed = lazy(() => import("../../src/pages/Feeds/FollowFeed/index"));
const FriendFeed = lazy(() => import("../../src/pages/Feeds/FriendFeed/index"));
const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <CircularProgress /> */}
          <Loading />
        </Box>
      }
    >
      <Routes>
        {/* element={<Navigate to="/auth/login" replace />} */}
        <Route path="/">
          <Route path="" element={<MainPage />} />
          <Route path="feeds" element={<FeedTable />} />
          {/* <Route path="feeds/like" element={<>Yeu thich</>} /> */}
          {/* <Route path="feeds/list" element={<>ban be</>} /> */}
          <Route path="feeds/follows" element={<FollowFeed />} />
          <Route path="feeds/friends" element={<FriendFeed />} />
          <Route path="friends" element={<FriendPage />} />
          <Route path="profile" element={<ProfilePage />}></Route>
          <Route path="friends/requests" element={<FriendRequestPage />} />
          <Route
            path="friends/suggestions"
            element={<FriendSuggestionPage />}
          />
          <Route path="friends/list" element={<ListFriend />} />
          <Route path="friends/follow-page" element={<FollowPage />} />
          <Route path="friends/following-page" element={<FollowingList />} />
          <Route path="resources" element={<ResourcePage />} />
          <Route path="save" element={<SaveItemPage />} />
        </Route>
        <Route path="/admin">
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="user" element={<User />} />
          <Route path="file" element={<File />} />
          <Route path="" element={<AdminPage />} />
        </Route>
        <Route path="/auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<UpdateProfile />} />
        </Route>
        <Route path="/socket" element={<Socket />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/download" element={<Download />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
