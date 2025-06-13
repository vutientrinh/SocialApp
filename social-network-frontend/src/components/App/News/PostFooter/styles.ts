import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export const PostFooterStyled = styled("div")({
  backgroundColor: "transparent",
});

export const PostContentStyled = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 60px",
});

export const StyledIconButton = styled(IconButton)({
  padding: "0px",
  minWidth: "100px",
  borderRadius: 0,
  overflow: "hidden",
  "& .MuiTouchRipple-root": {
    borderRadius: 0,
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
});
