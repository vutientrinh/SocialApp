import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import { SidebarProps, SidebarContextProps } from "./type";

// SidebarContext for managing sidebar state
export const SidebarContext = React.createContext<SidebarContextProps>({
  width: "270px",
  collapsewidth: "80px",
  textColor: "#8D939D",
  isCollapse: false,
  themeColor: "#5d87ff",
});

// Sidebar component definition
const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      children,
      width = "260px",
      collapsewidth = "78px",
      textColor = "#2b2b2b",
      isCollapse = false,
      themeColor = "#e7a800",
      themeSecondaryColor = "#49beff",
      mode = "light",
      direction = "ltr",
      sx,
    },
    ref
  ) => {
    const [isSidebarHover, setIsSidebarHover] = React.useState(false);
    const toggleWidth = isCollapse && !isSidebarHover ? collapsewidth : width;
    const SideBarTheme = createTheme({
      direction,
      palette: {
        mode,
        primary: {
          main: themeColor,
        },
        secondary: {
          main: themeSecondaryColor,
          contrastText: "#fff",
        },
      },
    });

    if (mode === "dark") {
      textColor = "rgba(255,255,255, 0.9)";
    }

    return (
      <ThemeProvider theme={SideBarTheme}>
        <Box
          dir={direction}
          sx={{
            width: toggleWidth,
            height: "100vh",
            flexShrink: 0,
            fontFamily: "popins",
            color: textColor,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
            ...sx,
          }}
        >
          <Box
            sx={{
              width: toggleWidth,
              flex: 1,
              overflow: "auto",
            }}
          >
            <SidebarContext.Provider
              value={{
                textColor,
                isCollapse,
                width,
                collapsewidth,
                themeColor,
              }}
            >
              {children}
            </SidebarContext.Provider>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
);

export default Sidebar;
