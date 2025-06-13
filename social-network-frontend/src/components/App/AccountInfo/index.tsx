import { Avatar, Box, Typography } from "@mui/material";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { dialogStore, followStore, postStore } from "../../../store/reducers";

interface Account {
  username: string;
  email: string;
  photoURL: string;
}

// default account
const defaultAccount: Account = {
  username: "Jaydon Frankie",
  email: "demo@minimals.cc",
  photoURL: "/static/avatars/avatar_default.jpg",
};

const AccountInfo: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const numFollowing = useSelector(followStore.selectNumFollowing);
  const numFollowers = useSelector(followStore.selectNumFollowers);
  const numPosts = useSelector(dialogStore.selectNumPosts);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies["accessToken"];
    const currentUser = {
      username: cookies["username"],
      email: cookies["email"],
      photoURL: cookies["photoURL"] || defaultAccount.photoURL,
    };
    setAccount(currentUser);

    // count following
    dispatch(followStore.sagaCountFollowing());
    dispatch(postStore.sagaSetNumPosts());

    // get profile info
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const result = data.data;
        const profile = {
          firstName: result.firstName,
          middleName: result.middleName,
          lastName: result.lastName,
          avatar: result.avatar,
        };
        setProfile(profile);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* User Profile */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginBottom: "12px",
        }}
      >
        <Avatar
          src={profile?.avatar}
          alt="avatar"
          sx={{ marginRight: "10px" }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {profile?.firstName} {profile?.middleName} {profile?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{account?.username}
          </Typography>
        </Box>
      </Box>

      {/* User Stats */}
      <Box
        sx={{
          display: "flex",
          // gap: "30px",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t("follow.following")}
          </Typography>
          <Typography variant="subtitle2" fontWeight="medium">
            {numFollowing}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t("follow.follower")}
          </Typography>
          <Typography variant="subtitle2" fontWeight="medium">
            {numFollowers}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t("post.post")}
          </Typography>
          <Typography variant="subtitle2" fontWeight="medium">
            {numPosts}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountInfo;
