import DescriptionIcon from "@mui/icons-material/Description";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { dialogStore, profileStore } from "../../store/reducers";
import ProfileMedia from "./ProfileMedia";
import ProfilePost from "./ProfilePost";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile-post");
  const isSelectedProfile = useSelector(dialogStore.selectIsSelectedProfile);

  const profile = useSelector(
    isSelectedProfile
      ? profileStore.selectProfileLogin
      : dialogStore.selectSelectedProfile
  );

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const renderTab = () => {
    switch (tab) {
      case "profile-post":
        return (
          <Box sx={{ width: "100%" }}>
            <ProfilePost key="profile-post" />
          </Box>
        );
      case "profile-media":
        return <ProfileMedia key="profile-media" />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "20px",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minHeight: "300px",
          backgroundImage: `url("https://images-assets.nasa.gov/image/DSC_5664/DSC_5664~medium.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          borderRadius: "8px",
        }}
      >
        <Avatar
          src={profile.avatar}
          alt="avatar"
          sx={{
            width: "150px",
            height: "150px",
            position: "absolute",
            top: "230px",
            left: "11%",
            border: "5px solid white",
          }}
        />
        {/* <Box sx={{ textAlign: "center", mb: 2, width: "30%" }}>
          <Typography variant="h5" fontWeight="bold">
            {profile.firstName} {profile.middleName} {profile.lastName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {profile.createdBy.friends.length} bạn bè
          </Typography>
        </Box> */}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mt: 6,
          width: "80%",
          gap: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2, width: "30%" }}>
          <Typography variant="h5" fontWeight="bold">
            {profile.firstName} {profile.middleName} {profile.lastName}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {profile.createdBy.friends.length} {t("friend.friend")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            border: "1px solid #cccccc",
            padding: "16px",
            borderRadius: "8px",
            width: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <PhoneAndroidIcon sx={{ mr: 1 }} />
            <Typography>
              {t("profile.phoneNumber")}: {profile.phoneNumber}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <DescriptionIcon sx={{ mr: 1 }} />
            <Typography>
              {t("profile.description")}: {profile.bio}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <InsertInvitationIcon sx={{ mr: 1 }} />
            <Typography>
              {t("profile.dateOfBirth")}: {profile.dateOfBirth}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/chat");
              }}
            >
              {t("profile.message")}
            </Button>
          </Box>
        </Box>
      </Box>
      <Divider />
      {/* Render tab */}
      <Box sx={{ width: "100%", paddingTop: 2, minHeight: "100%" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="primary"
          aria-label="profile tabs"
          sx={{
            fontSize: "20px",
            width: "100%",
            display: "flex",
          }}
        >
          <Tab
            value="profile-post"
            label={t("profile.posts")}
            sx={{
              textTransform: "none",
              fontSize: "15px",
              maxWidth: "100%",
              flex: 1,
            }}
          />
          <Tab
            value="profile-media"
            label={t("profile.media")}
            sx={{
              textTransform: "none",
              fontSize: "15px",
              maxWidth: "100%",
              flex: 1,
            }}
          />
        </Tabs>
        {renderTab()}
      </Box>
    </Box>
  );
};

export default Profile;
