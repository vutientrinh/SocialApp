import React from "react";
import { MenuItemProps } from "./type";
import { SidebarContext } from "./Sidebar";
import { useTheme, styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import {
  Box,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Link,
} from "@mui/material";
import { CircleOutlined } from "@mui/icons-material";

const MenuItem = React.forwardRef<HTMLDivElement, MenuItemProps>(
  (
    {
      children,
      icon,
      link = "#",
      badge = false,
      badgeColor = "secondary",
      badgeContent = "6",
      textFontSize = "14px",
      borderRadius = "8px",
      disabled = false,
      badgeType = "filled",
      target = "",
    },
    ref
  ) => {
    const customizer = React.useContext(SidebarContext);
    const theme = useTheme();
    const location = useLocation();
    const isSelected = location.pathname === link;

    const ListItemStyled = styled(ListItemButton)(() => ({
      whiteSpace: "nowrap",
      marginBottom: "2px",
      padding: "10px 12px",
      textAlign: theme.direction === "ltr" ? "left" : "right",
      borderRadius: borderRadius,
      color: customizer.textColor,
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? "0.6" : "1",
      ".MuiListItemIcon-root": {
        color: customizer.textColor,
      },
      "&:hover": {
        backgroundColor: disabled ? "#fff" : customizer.themeColor + 20,
        color: customizer.themeColor,
        ".MuiListItemIcon-root": {
          color: customizer.themeColor,
        },
      },
      "&.Mui-selected": {
        color: "white",
        backgroundColor: customizer.themeColor,
        "&:hover": {
          backgroundColor: customizer.themeColor,
          color: "white",
        },
        ".MuiListItemIcon-root": {
          color: "#fff",
        },
      },
    }));

    return (
      <Box sx={{ marginBottom: 0.5 }}>
        <Link href={link} style={{ textDecoration: "none" }}>
          <ListItemStyled
            sx={{ display: "flex", gap: "15px" }}
            selected={isSelected}
          >
            <ListItemIcon
              sx={{
                minWidth: "0px",
              }}
            >
              {icon ? icon : <CircleOutlined />}
            </ListItemIcon>
            {!customizer.isCollapse ? (
              <>
                <ListItemText sx={{ my: 0 }}>
                  <Typography
                    fontSize={textFontSize}
                    sx={{ lineHeight: "1" }}
                    variant="caption"
                  >
                    {children}
                  </Typography>
                </ListItemText>

                {badge ? (
                  <Chip
                    label={badgeContent}
                    color={badgeColor}
                    variant={badgeType}
                    size="small"
                  />
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </ListItemStyled>
        </Link>
      </Box>
    );
  }
);

export default MenuItem;
