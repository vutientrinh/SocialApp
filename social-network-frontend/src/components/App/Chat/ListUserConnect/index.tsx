import CircleIcon from "@mui/icons-material/Circle";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userStore } from "../../../../store/reducers";

import { Client, Stomp } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "../../../../Path/backend";
import Logo from "../../Common/Logo/Logo";
import {
  IconButtonStyles,
  UserInforStyle,
  UserItemStyle,
  UserListStyle,
  UserOnlineStyle,
} from "./styles";
import { useTranslation } from "react-i18next";

interface UserProfile {
  online: boolean;
  avatar: string; // Adjust this type based on your actual data structure (e.g., `string | null`).
  createdBy: User;
}
interface User {
  uuid: string;
  username: string;
}

const ListUserConnection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedUUID, setSelectedUUID] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const dispatch = useDispatch();
  const cookies = parseCookies();
  let uuid = cookies["uuid"];
  const token = cookies["accessToken"];
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [listUserProfile, setListUserProfile] = useState<UserProfile[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(userStore.sagaGetList());
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);
    const onConnect = () => {
      console.log("Connected to WebSocket successfully.");
      stompClient.subscribe(`/topic/public`, (message) => {
        fetchAllProfile();
      });
    };

    // Connect with error handling
    stompClient.connect({}, onConnect);
    setStompClient(stompClient);
    fetchProfile();
    fetchAllProfile();
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);
  const handleClick = (
    online: boolean,
    uuid: string,
    username: string,
    avatar: string
  ) => {
    dispatch(
      userStore.sagaSelectedReceiverUUID({
        online: online,
        receiverUUID: uuid,
        username: username,
        avatar: avatar,
      })
    );
    setSelectedUUID(uuid); // Update the selected UUID
  };
  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-user-uuid/${uuid}`,
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
      setAvatar(result.avatar);
      setUsername(result.createdBy.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // fetch profile
  const fetchAllProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/profile/get-all-profiles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const sortedProfiles = data.data.sort(
        (a: UserProfile, b: UserProfile) => {
          return Number(b.online) - Number(a.online);
        }
      );

      setListUserProfile(sortedProfiles);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // fetch profile

  return (
    <UserListStyle>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "10%",
          width: "100%",
        }}
      >
        <Logo img="/static/logo/sentry-full.svg">Logo</Logo>
      </Box>
      <UserInforStyle>
        <Avatar
          src={avatar}
          alt="avatar"
          style={{ width: "50px", height: "50px" }}
        />
        <Typography
          variant="subtitle1"
          style={{ fontSize: "24px", marginLeft: 10, marginRight: 5 }}
        >
          {username}
        </Typography>
      </UserInforStyle>
      <UserOnlineStyle>
        {listUserProfile.length > 0 ? (
          listUserProfile.map((user, index) =>
            user.createdBy.uuid === uuid ? null : (
              <UserItemStyle
                key={index}
                onClick={() =>
                  handleClick(
                    user.online,
                    user.createdBy.uuid,
                    user.createdBy.username,
                    user.avatar
                  )
                }
                sx={{
                  backgroundColor:
                    selectedUUID === user.createdBy.uuid
                      ? "#4F95C4"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", margin: 2 }}>
                  <IconButtonStyles>
                    <Avatar src={user.avatar} alt="photoURL" />
                    {user.online == true ? (
                      <CircleIcon
                        sx={{
                          fontSize: 12,
                          color: "#4caf50",
                          position: "absolute",
                          marginLeft: 3,
                          marginTop: 4,
                        }}
                      />
                    ) : null}
                  </IconButtonStyles>
                  <Typography variant="subtitle1">
                    {user.createdBy.username}
                  </Typography>
                </Box>
              </UserItemStyle>
            )
          )
        ) : (
          <div>No users available</div>
        )}
      </UserOnlineStyle>
      <Box
        sx={{
          height: "10%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => navigate("/")}>{t("chat.backMainPage")}</Button>
      </Box>
    </UserListStyle>
  );
};

export default ListUserConnection;
