import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

export const UserItemStyle = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "10px",
  margin: "10px",
  borderRadius: "10px",
  backgroundColor: "#f5f5f5",
});

export const IconButtonStyles = styled(IconButton)({
  width: 30,
  height: 30,
  marginRight: 20,
  position: "relative",
});

export const LinkStyles = styled(Link)({
  textDecoration: "none",
  color: "black",
});
