import { Box, Grid2 } from "@mui/material";
import React from "react";
import Logo from "../Common/Logo/Logo";
import LanguagePopover from "../LanguagePopover/index";
import NotificationsPopover from "../Notification";
import AccountPopover from "../Account";
import SearchCustom from "../SeachBar/index";

const Navbar = React.forwardRef((props, ref) => {
  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{
        height: 64,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "20%",
        }}
      >
        <Logo img="/static/logo/sentry-full.svg">Logo</Logo>
      </Box>

      {/* Search Bar */}
      {/* <SearchCustom searchTitle={"navbar.search"} /> */}

      {/* Popovers: Language, Notifications, Account */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <LanguagePopover />
        <NotificationsPopover />
        <AccountPopover />
      </Box>
    </Grid2>
  );
});

export default Navbar;
