import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// Adjusted to accept open prop for dynamic styling
export const ListActiveUsersStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ open }) => ({
  display: "flex",
  flexDirection: "column",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  backgroundColor: "white",
  width: "25%",
  height: "100%",
  // zIndex: 10,
  position: "fixed",
  top: open ? "95%" : "60%",
  transition: "top 0.3s ease-in-out",
}));

export const BoxUserStyle = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "0px 10px",
  gap: "10px",
  marginTop: "2px",
  marginBottom: "2px",
});
