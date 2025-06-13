import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const SenderStyle = styled(Box)({
  display: "flex",
  borderRadius: "8px",
  padding: "10px",
  marginLeft: "auto",
  justifyContent: "end",
  alignItems: "center",
});
export const ReceiveStyle = styled(Box)({
  display: "flex",
  borderRadius: "8px",
  padding: "10px",
  alignItems: "center",
});

export const ChatStyle = styled(Box)({
  borderRadius: "8px",
  margin: "10px",
});

export const SenderMessageDisplayStyle = styled(Box)({
  display: "block",
  userSelect: "none",
  paddingLeft: "16px",
  paddingRight: "16px",
  paddingTop: "8px", // Add top padding for better spacing
  paddingBottom: "8px", // Add bottom padding for balance
  borderRadius: "20px", // Rounded corners for a softer look
  backgroundColor: "#87D3F8", // Soft blue background
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow for depth
  transition: "all 0.3s ease", // Smooth transition on hover
  "&:hover": {
    backgroundColor: "#6ab7e6", // Slightly darker on hover
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)", // Enhance shadow on hover
  },
});

export const ReceiverMessageDisplayStyle = styled(Box)({
  display: "block",
  backgroundColor: "#DFF2EB",

  userSelect: "none",
  paddingLeft: "16px",
  paddingRight: "16px",
  paddingTop: "8px", // Add top padding for better spacing
  paddingBottom: "8px", // Add bottom padding for balance
  borderRadius: "20px", // Rounded corners for a softer look
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow for depth
  transition: "all 0.3s ease", // Smooth transition on hover
  "&:hover": {
    backgroundColor: "#C2D7CF", // Slightly darker on hover
    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)", // Enhance shadow on hover
  },
});
