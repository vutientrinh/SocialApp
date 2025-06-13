import React from "react";
import { SidebarContext } from "./Sidebar";
import { MenuProps } from "./type";
import ListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { Typography } from "@mui/material";

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ children, subHeading = "menu" }, ref) => {
    const customizer = React.useContext(SidebarContext);

    return (
      <Box sx={{ px: customizer.isCollapse ? 2 : 3, pt: 2 }}>
        <List
          ref={ref}
          component="nav"
          subheader={
            <ListSubheader
              component="div"
              sx={{
                paddingY: "3px",
                color: customizer.textColor,
                paddingX: "1px",
                lineHeight: "20px",
                fontWeight: "bold",
                fontSize: "18px",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontSize: 18, fontWeight: "bold", fontFamily: "Poppins" }}
              >
                {!customizer.isCollapse ? subHeading : "..."}
              </Typography>
            </ListSubheader>
          }
        >
          {children}
        </List>
      </Box>
    );
  }
);

export default Menu;
