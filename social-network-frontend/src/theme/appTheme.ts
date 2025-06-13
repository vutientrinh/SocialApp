import { createTheme } from "@mui/material";
import components from "./components";
import typography from "./typography";
import palette from "./palette";

const appTheme = createTheme({
  typography,
  components,
  shape: {
    borderRadius: 2,
  },
  palette,
});

export default appTheme;
