import { Box, IconButton, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

export const UserListStyle = styled(Box)({
  backgroundColor: "rgba(189, 206, 222, 0.5)",
  width: "25%",
  height: "100vh",
  flexDirection: "column", // Ensures that the child elements stack vertically
  overflowY: "auto",
  userSelect: "none",
});
export const UserItemStyle = styled(Box)({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#4F95C4",
  transition: "all 0.3s ease", // Smooth transition on hover
  "&:hover": {
    backgroundColor: "#4685AF", // Slightly darker on hover
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)", // Enhance shadow on hover
  },
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

export const UserInforStyle = styled(Box)({
  height: "10%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#87D3F8", // Soft blue background
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow for depth
  transition: "all 0.3s ease", // Smooth transition on hover
  "&:hover": {
    backgroundColor: "#6ab7e6", // Slightly darker on hover
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)", // Enhance shadow on hover
  },
});

export const UserOnlineStyle = styled(Box)({
  height: "70%",
  overflowY: "auto",
});
