import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PublicIcon from "@mui/icons-material/Public";
import HttpsIcon from "@mui/icons-material/Https";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postStore, profileStore } from "../../../../store/reducers";
import { convertToDate, fToNow } from "../../../../utils/formatTime";
import {
  ActionButtons,
  PostAuthorInfo,
  PostHeaderContainer,
  PostMetadata,
} from "./styles";

export interface UserInfo {
  uuid: string;
  username: string;
  lastUpdateAt: any;
  status: string;
  postId: string;
}
export interface ProfileOwner {
  firstName: string;
  middleName: string;
  lastName: string;
  createdAt: any;
  phoneNumber: string;
  dateOfBirth: any;
  bio: string;
  gender: string;
  avatar: string;
}

// uuid: user's uuid
// username: post owner
// lastUpdateAt: post created date
const PostHeader: React.FC<UserInfo> = ({
  uuid,
  username,
  lastUpdateAt,
  status,
  postId,
}) => {
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = React.useState<ProfileOwner | null>(
    null
  );
  const profiles = useSelector(profileStore.selectCacheProfiles);

  const findProfileByUUID = (uuid: string) => {
    return profiles.find((profile) => profile.createdBy.uuid === uuid);
  };

  const fetchProfileByUsername = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-username/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      setUserProfile(result.data);
    } catch (error) {
      console.error("Error fetching profile by username:", error);
    }
  };

  // pagination
  const page = useSelector(postStore.selectPage);
  const size = useSelector(postStore.selectSize);

  useEffect(() => {
    // dispatch(postStore.sagaGetPosts());
    // dispatch(postStore.TSagaGetPosts(page, size));
    const value = findProfileByUUID(uuid);
    fetchProfileByUsername();
    setUserProfile(value);
  }, []);

  return (
    <PostHeaderContainer>
      {/* Author Information Section */}
      <PostAuthorInfo>
        <IconButton>
          <Avatar src={userProfile?.avatar} alt="photoURL" />
        </IconButton>
        <Box>
          <Typography variant="subtitle1" component="div">
            {userProfile?.firstName} {userProfile?.middleName}{" "}
            {userProfile?.lastName}
          </Typography>
          <PostMetadata>
            <Typography variant="caption">
              {" "}
              {fToNow(convertToDate(lastUpdateAt.toString()))}
            </Typography>
            <Typography variant="caption">•</Typography>
            {/* icon button */}
            <IconButton sx={{ padding: "0px" }}>
              {status === "PUBLIC" ? (
                <PublicIcon fontSize="small" />
              ) : (
                <HttpsIcon fontSize="small" />
              )}
            </IconButton>
          </PostMetadata>
        </Box>
      </PostAuthorInfo>

      {/* Action Buttons */}
      <ActionButtons>
        {/* <IconButton>
          <MoreHorizIcon />
        </IconButton> */}
        <IconButton
          onClick={() => {
            dispatch(postStore.updateStatusPost(postId, "FRIENDS"));
          }}
        >
          <CloseIcon />
        </IconButton>
      </ActionButtons>
    </PostHeaderContainer>
  );
};

export default PostHeader;
