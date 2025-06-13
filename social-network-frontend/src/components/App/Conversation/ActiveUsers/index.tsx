import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import Scrollbar from "../../Common/Scrollbar/Scrollbar";
import { BoxUserStyle, ListActiveUsersStyle } from "./styles";

const ListActiveUsers: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  // Toggle function for open/close
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <ListActiveUsersStyle open={open}>
      {/* Header for active users list */}
      <Box
        onClick={handleToggle}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 10px",
          cursor: "pointer",
        }}
      >
        <Typography variant="subtitle2" component="div">
          Người liên hệ
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Collapsible List of Active Users */}
      <Divider />
      {!open && (
        <>
          <Scrollbar sx={{ maxHeight: "100%" }}>
            <BoxUserStyle>
              {/* <UserItem uuid="1234" username="Hồ Thanh Duy" /> */}
              <p>diahfajdslkadsjhflaks </p>
            </BoxUserStyle>
          </Scrollbar>
        </>
      )}
    </ListActiveUsersStyle>
  );
};

export default ListActiveUsers;
