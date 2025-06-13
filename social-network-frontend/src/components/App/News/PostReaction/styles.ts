import styled from "@mui/material/styles/styled";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

// Extend IconButtonProps to include the custom index prop
interface StyledIconButtonProps extends IconButtonProps {
  index: number;
}

export const PostReactionStyled = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "transparent",
  position: "relative",
}));

export const ReactionComponent = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  position: "relative",
  marginLeft: "10px",
  backgroundColor: "transparent",
  "& img": {
    width: "24px",
    height: "24px",
  },
}));

export const StyledIconButton = styled(IconButton)<StyledIconButtonProps>(
  ({ index }) => ({
    position: "absolute",
    padding: "0px",
    marginRight: "6px",
    left: `${index * 18}px`,
  })
);

export const InfoComponent = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "10px",
  justifyContent: "space-between",
  backgroundColor: "transparent",
}));

export const StyleLinkReaction = styled(Link)({
  textDecoration: "none",
  marginLeft: "120px",
  color: "#000",
  "&:hover": {
    textDecoration: "underline",
  },
});

export const StyleLink = styled(Box)({
  textDecoration: "none",
  color: "#000",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});
