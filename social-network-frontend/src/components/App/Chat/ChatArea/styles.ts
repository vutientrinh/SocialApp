import { Box, Button, OutlinedInput } from "@mui/material";
import { styled } from "@mui/material/styles";

// Main chat area container
export const ChatAreaStyle = styled(Box)({
  borderRadius: "8px",
  width: "100%",
  height: "100vh",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
});

// Header area styling
export const HeadingStyle = styled(Box)({
  position: "relative",
  height: "10%",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  borderBottom: "1px solid #e0e0e0",
  color: "#ffffff",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
});

export const UserHeadingStyle = styled(Box)({
  position: "relative",
  height: "100%",
  padding: "0 16px",
  width: "100%",
  display: "flex",
  alignItems: "center",
});

export const DisplayChatStyle = styled(Box)({
  display: "flex",
  height: "80%",
  flexDirection: "column",
  overflowY: "auto",
  padding: "16px",
  backgroundColor: "rgba(189, 206, 222, 0.5)",
});

export const ChatInputStyle = styled(Box)({
  display: "flex",
  padding: "8px 16px",
  alignItems: "center",
  gap: "10px",
  backgroundColor: "#f9fafc",
});

// User message item styling
export const UserItemStyle = styled(Box)({
  display: "flex",
  flexDirection: "column",
  padding: "10px 16px",
  margin: "8px 0",
  borderRadius: "10px",
  backgroundColor: "#e1f5fe",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  maxWidth: "80%",
  alignSelf: "flex-start",
});

// Customized input and send button
export const StyledInput = styled(OutlinedInput)({
  flex: 1,
  borderRadius: "20px",
  padding: "8px 16px",
  backgroundColor: "#ffffff",
  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
});

export const StyledSendButton = styled(Button)({
  borderRadius: "50%",
  minWidth: "40px",
  height: "40px",
  padding: "0",
  color: "#ffffff",
  backgroundColor: "#0073e6",
  "&:hover": {
    backgroundColor: "#005bb5",
  },
});
