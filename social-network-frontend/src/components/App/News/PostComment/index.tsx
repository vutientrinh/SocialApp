import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState } from "react";
import { commentBoxStyles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import {
  commentStore,
  postStore,
  profileStore,
} from "../../../../store/reducers";
import { convertToDate, fToNow } from "../../../../utils/formatTime";
import { useTranslation } from "react-i18next";

export interface UserInfo {
  uuid: string;
  username: string;
  lastUpdateAt: any;
}

export interface Reaction {
  createdAt: Date;
  createdBy: UserInfo;
}

export interface Comment {
  content: Content;
  createdAt: any;
  createdBy: UserInfo;
  uuid: string;
}

export interface ImageURLS {
  createdAt: any;
  name: string;
  url: string;
  uuid: string;
}
export interface Content {
  createdAt: any;
  createdBy: UserInfo;
  imageURLs: ImageURLS[];
  message: string;
  uuid: string;
}
export interface PostList {
  uuid: string;
  content: Content;
  reactions: Reaction[];
  comments: Comment[];
  status: string;
  user: UserInfo;
  createdDateAt: any;
}

export interface ProfileCommenter {
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

const PostComments: React.FC<PostList> = ({
  uuid,
  content,
  reactions,
  comments,
  status,
  user,
  createdDateAt,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(profileStore.selectProfile);
  const profiles = useSelector(profileStore.selectCacheProfiles);
  const [commenterProfiles, setCommenterProfiles] = useState<
    Record<string, ProfileCommenter>
  >({});
  const [message, setMessage] = useState("");

  const findProfileByUUID = (uuid: string) => {
    return profiles.find((profile) => profile.createdBy.uuid === uuid);
  };

  // change message
  const handleSentComment = () => {
    dispatch(commentStore.actions.setMessageNewComment(message));
    dispatch(commentStore.actions.setPostUUID(uuid));
    dispatch(commentStore.createComment(uuid));
    setMessage("");
  };

  const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilePromises = comments.map(async (comment) => {
        const username = comment.createdBy.username;
        if (!commenterProfiles[username]) {
          const profile = findProfileByUUID(comment.createdBy.uuid);
          if (profile) {
            setCommenterProfiles((prev) => ({
              ...prev,
              [username]: profile,
            }));
          }
        }
      });
      await Promise.all(profilePromises);
    };

    fetchProfiles();
  }, [comments, commenterProfiles]);

  return (
    <Box sx={{ padding: "0px 20px" }}>
      <Divider />

      {/* Display all comments */}
      {comments.map((comment) => (
        <Box
          key={comment.uuid}
          sx={{ display: "flex", width: "100%", margin: "12px 0px" }}
        >
          <Avatar
            src={commenterProfiles[comment.createdBy.username]?.avatar || ""}
            alt={comment.createdBy.username}
            sx={{ marginRight: "10px" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={commentBoxStyles}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {`${commenterProfiles[comment.createdBy.username]?.firstName} 
    ${commenterProfiles[comment.createdBy.username]?.middleName} 
    ${commenterProfiles[comment.createdBy.username]?.lastName}`}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {fToNow(convertToDate(comment.createdAt.toString()))}
                </Typography>
              </Box>
              <Typography variant="body1">{comment.content.message}</Typography>
            </Box>
          </Box>
        </Box>
      ))}

      <Divider sx={{ margin: "12px 0" }} />

      {/* Comment from current login user */}
      <Box sx={{ display: "flex", width: "100%", margin: "12px 0px" }}>
        <Link to="/">
          <Avatar
            src={currentUser.profileLogin?.avatar}
            alt="User avatar"
            sx={{ marginRight: "10px" }}
          />
        </Link>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Box sx={commentBoxStyles}>
            <InputBase
              placeholder={t("post.writeComment")}
              fullWidth
              multiline
              sx={{ ml: 1, flex: 1, paddingRight: "10px" }}
              value={message}
              onChange={handleChangeMessage}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <IconButton sx={{ padding: "2px" }}>
                <InsertEmoticonIcon color="action" />
              </IconButton>
              <IconButton onClick={handleSentComment}>
                <SendIcon color="action" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostComments;
