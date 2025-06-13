import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import FeedIcon from "@mui/icons-material/Feed";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import { Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const ArrowBarStyle = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  "& > *": {
    margin: "5px 0",
    cursor: "pointer",
  },
  "& > *:hover": {
    backgroundColor: "#f0f2f5",
    borderRadius: "10px",
  },
});

export const BoxStyle = styled(Box)({
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  width: "100%",
  padding: "5px",
  borderRadius: "10px",
});

const ArrowBar: React.FC = () => {
  const { t } = useTranslation();
  return (
    <ArrowBarStyle>
      <Link
        to="/feeds"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <BoxStyle>
          <IconButton>
            <FeedIcon />
          </IconButton>
          <Typography>{t("mainPage.feed")}</Typography>
        </BoxStyle>
      </Link>
      <Link
        to="/friends"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <BoxStyle>
          <IconButton>
            <GroupIcon />
          </IconButton>
          <Typography>{t("mainPage.friend")}</Typography>
        </BoxStyle>
      </Link>
      <Link
        to="/resources"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <BoxStyle>
          <IconButton>
            <Inventory2Icon />
          </IconButton>
          <Typography>{t("mainPage.resource")}</Typography>
        </BoxStyle>
      </Link>
      <Link
        to="/save"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <BoxStyle>
          <IconButton>
            <TurnedInIcon />
          </IconButton>
          <Typography>{t("mainPage.savedItems")}</Typography>
        </BoxStyle>
      </Link>
      <Link
        to="/chat"
        style={{ textDecoration: "none", color: "inherit", width: "100%" }}
      >
        <BoxStyle>
          <IconButton>
            <ChatRoundedIcon />
          </IconButton>
          <Typography>{t("mainPage.chat")}</Typography>
        </BoxStyle>
      </Link>
    </ArrowBarStyle>
  );
};

export default ArrowBar;
