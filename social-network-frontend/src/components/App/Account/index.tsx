import { useRef, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// @mui
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
// components
import { parseCookies } from "nookies";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { commonStore, dialogStore } from "../../../store/reducers";
import MenuPopover from "../Common/MenuPopover/MenuPopover";

import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "../../../Path/backend";

interface Account {
  username: string;
  email: string;
  photoURL: string;
}

// default account
const defaultAccount: Account = {
  username: "Jaydon Frankie",
  email: "demo@minimals.cc",
  photoURL: "/static/avatars/avatar_default.jpg",
};

export default function AccountPopover() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const userRoleCookies = cookies["role"];
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  const [stompClient, setStompClient] = useState<Client | null>(null);
  let uuid = cookies["uuid"];

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies["accessToken"];
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, null);

    setStompClient(stompClient);

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const result = data.data;
        const profile = {
          firstName: result?.firstName,
          middleName: result?.middleName,
          lastName: result?.lastName,
          avatar: result?.avatar
            ? result?.avatar
            : "/static/avatars/avatar_default.jpg",
        };
        setProfile(profile);
        dispatch(dialogStore.setSelectedProfile(result));
        dispatch(dialogStore.actionToSetProfilePost()); // trigger to get posts data for profile
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    // fetch profile
    fetchProfile();

    const currentUser = {
      username: cookies["username"],
      email: cookies["email"],
      photoURL: defaultAccount.photoURL,
    };
    setAccount(currentUser);
  }, []);
  const sendDisConnect = async (user: string) => {
    if (stompClient) {
      try {
        stompClient.publish({
          destination: "/app/user.disconnectUser",
          body: JSON.stringify(user),
        });
        stompClient.deactivate();
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.error("STOMP client is not connected.");
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(dialogStore.setIsSelectedProfile(true));
    setOpen(null);
  };

  const handleLogout = () => {
    setOpen(null);
    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    sendDisConnect(uuid);
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={profile?.avatar} alt="avatar" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {account?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {account?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem
            component={RouterLink}
            to={userRoleCookies === "ROLE_ADMIN" ? "/admin" : "/"}
            onClick={() => {
              handleClose();
              if (userRoleCookies !== "ROLE_ADMIN")
                dispatch(
                  commonStore.actions.setErrorMessage(t("account.accessDenied"))
                );
            }}
          >
            {t("account.home")}
          </MenuItem>
          <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
            {t("account.profile")}
          </MenuItem>
          <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>
            {t("account.setting")}
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          {t("account.logout")}
        </MenuItem>
      </MenuPopover>
    </>
  );
}
