import CircleIcon from "@mui/icons-material/Circle";
import { Avatar, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userStore } from "../../../../store/reducers";
import { IconButtonStyles, UserItemStyle } from "./styles";

interface UserItemProps {
  online: boolean;
  username: string;
  uuid: string;
  avatar: string;
}

const UserItem: React.FC<UserItemProps> = ({
  online,
  uuid,
  username,
  avatar,
}) => {
  const dispatch = useDispatch();

  const [selectedUUID, setSelectedUUID] = useState(false);

  const handleClick = (uuid: string) => {
    dispatch(
      userStore.sagaSelectedReceiverUUID({
        online: online,
        receiverUUID: uuid,
        username: username,
        avatar: avatar,
      })
    );
    setSelectedUUID(!selectedUUID); // Update the selected UUID
  };
  useEffect(() => {
    setSelectedUUID(false);
  }, [uuid, dispatch]);

  return (
    <UserItemStyle
      onClick={() => handleClick(uuid)}
      sx={{
        backgroundColor: selectedUUID == true ? "lightblue" : "transparent",
        cursor: "pointer",
        borderRadius: "8px",
        padding: "8px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButtonStyles>
          <Avatar src={""} alt="photoURL" />
          <CircleIcon
            sx={{
              fontSize: 12,
              color: "#4caf50",
              position: "absolute",
              marginLeft: 3,
              marginTop: 4,
            }}
          />
        </IconButtonStyles>
        <Typography variant="subtitle1">{username}</Typography>
      </Box>
    </UserItemStyle>
  );
};

export default UserItem;
