import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";

export const LoginStyle = styled(Box)({
  display: "flex",
  position: "relative",
  zIndex: 2,
  height: "80vh",
  width: "60vw",
  justifyContent: "center",
  alignItems: "center",
  margin: "10px",
  padding: "10px",
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  backgroundColor: "white",
});
export const ImageStyle = styled(Container)({
  display: "flex",
  height: "100%",
  // width: "50%",
});

export const InputStyle = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "0px 5%",
});
