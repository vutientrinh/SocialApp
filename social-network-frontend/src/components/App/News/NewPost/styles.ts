import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const NewPostStyle = styled(Box)({
  display: "flex",
  alignItems: "flex-start",
  padding: "16px",
  flexDirection: "column",
  borderRadius: "10px",
  marginBottom: "10px",
  border: "1px solid #e0e0e0",
});

export const SearchBar = styled(Box)({
  display: "flex",
  alignItems: "center",
  borderRadius: "30px",
  padding: "0 10px",
  width: "100%",
  height: "40px",
  boxSizing: "border-box",
  marginTop: "10px",
  border: "1px solid #e0e0e0",
});

export const PostInputContainer = styled(Box)({
  display: "flex",
  alignContent: "center",
  width: "100%",
  gap: "6px",
});

export const StyledIconButton = styled(IconButton)({
  padding: "0",
  borderRadius: 0,
  overflow: "hidden",
  "& .MuiTouchRipple-root": {
    borderRadius: 0,
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
});
