import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";

export const ArrowBar = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(1.25),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "10px",
  "& > *": {
    margin: theme.spacing(0.625, 0),
    cursor: "pointer",
  },
  "& > *:hover": {
    backgroundColor: theme.palette.action.hover,
    borderRadius: "10px",
  },
}));

export const ItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: theme.spacing(0.625),
  borderRadius: "10px",
  border: `1px solid ${theme.palette.divider}`,
}));
