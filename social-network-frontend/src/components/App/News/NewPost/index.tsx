import ImageIcon from "@mui/icons-material/Image";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dialogStore, profileStore } from "../../../../store/reducers";
import {
  NewPostStyle,
  PostInputContainer,
  SearchBar,
  StyledIconButton,
} from "./styles";
import { useTranslation } from "react-i18next";

const NewPost: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector(profileStore.selectProfile);
  useEffect(() => {
    dispatch(profileStore.getProfileByUser());
  }, [dispatch]);

  return (
    <NewPostStyle>
      <PostInputContainer>
        <IconButton>
          <Avatar src={currentUser.profileLogin?.avatar} alt="avatar" />
        </IconButton>
        <SearchBar>
          <InputBase
            placeholder={t("mainPage.howDoYouFeel", {
              firstName: currentUser.profileLogin?.firstName || "",
              middleName: currentUser.profileLogin?.middleName || "",
              lastName: currentUser.profileLogin?.lastName || "",
            })}
            sx={{
              width: "100%",
              paddingLeft: "10px",
            }}
            onClick={() => dispatch(dialogStore.setDisplayCreatePost(true))}
            readOnly
          />
        </SearchBar>
        <StyledIconButton
          onClick={() => dispatch(dialogStore.setDisplayCreatePost(true))}
        >
          <SendIcon />
        </StyledIconButton>
      </PostInputContainer>

      {/* Icons container for emoji and image icons */}
      <Box sx={{ display: "flex", gap: "16px", marginTop: "8px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button>
            <IconButton sx={{ padding: 0 }}>
              <InsertEmoticonIcon color="action" />
            </IconButton>
            <Typography variant="caption" sx={{ paddingLeft: 1 }}>
              Emojis
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button>
            <IconButton sx={{ padding: 0 }}>
              <ImageIcon color="action" />
            </IconButton>
            <Typography variant="caption" sx={{ paddingLeft: 1 }}>
              {t("mainPage.imageVideo")}
            </Typography>
          </Button>
        </Box>
      </Box>
    </NewPostStyle>
  );
};

export default NewPost;
