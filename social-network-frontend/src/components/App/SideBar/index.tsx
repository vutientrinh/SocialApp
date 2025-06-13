import { Box, Button, Typography } from "@mui/material";
import {
  AddHomeWorkRounded,
  ManageAccountsRounded,
  KeyboardDoubleArrowRightRounded,
  KeyboardDoubleArrowLeftRounded,
} from "@mui/icons-material";
import Sidebar from "../SideBar/Sidebar";
import Logo from "../Common/Logo/Logo";
import Menu from "../SideBar/Menu";
import MenuItem from "../SideBar/MenuItem";
import { useTranslation } from "react-i18next";
import TopicIcon from "@mui/icons-material/Topic";

const BASE_SIDEBAR_URL = "/admin";

interface SidebarWithCollapseButtonProps {
  isCollapse: boolean;
  onToggleSidebar: () => void;
}

const SidebarWithCollapseButton: React.FC<SidebarWithCollapseButtonProps> = ({
  isCollapse,
  onToggleSidebar,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Sidebar
        width={isCollapse ? "80px" : "260px"}
        isCollapse={isCollapse}
        sx={{
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
          backgroundColor: "white",
        }}
      >
        {!isCollapse ? (
          <Box sx={{ marginLeft: 10 }}>
            <Logo img="/static/logo/logo.svg">Logo</Logo>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Logo img="/static/logo/logo.svg">Logo</Logo>
          </Box>
        )}
        <Menu subHeading="Home">
          <MenuItem
            link={`${BASE_SIDEBAR_URL}/dashboard`}
            icon={<AddHomeWorkRounded />}
          >
            <Typography sx={{ fontFamily: "Poppins" }}>
              {t("navbar.dashboard")}
            </Typography>
          </MenuItem>
          <MenuItem
            link={`${BASE_SIDEBAR_URL}/user`}
            icon={<ManageAccountsRounded />}
          >
            <Typography sx={{ fontFamily: "Poppins" }}>
              {t("navbar.user")}
            </Typography>
          </MenuItem>
          <MenuItem link={`${BASE_SIDEBAR_URL}/file`} icon={<TopicIcon />}>
            <Typography sx={{ fontFamily: "Poppins" }}>
              {t("navbar.file")}
            </Typography>
          </MenuItem>
        </Menu>
      </Sidebar>

      <Box
        sx={{
          width: 30,
          height: 30,
          top: 70,
          position: "fixed",
          borderRadius: 10,
          zIndex: 1000,
          left: isCollapse ? "80px" : "245px",
        }}
      >
        <Button
          onClick={onToggleSidebar}
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: 10,
            minWidth: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          {isCollapse ? (
            <KeyboardDoubleArrowRightRounded />
          ) : (
            <KeyboardDoubleArrowLeftRounded />
          )}
        </Button>
      </Box>
    </>
  );
};

export default SidebarWithCollapseButton;
