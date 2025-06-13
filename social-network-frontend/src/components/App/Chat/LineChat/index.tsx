import { Avatar, Box, Typography } from "@mui/material";
import { parseCookies } from "nookies";
import { IconButtonStyles } from "../../Conversation/UserItem/styles";

import { useEffect, useState } from "react";
import { convertToDate, fToNow } from "../../../../utils/formatTime";
import {
  ChatStyle,
  ReceiverMessageDisplayStyle,
  ReceiveStyle,
  SenderMessageDisplayStyle,
  SenderStyle,
} from "./styles";

export interface ChatPros {
  senderUUID: string;
  message: string;
  timestamps: string;
}

const LineChat: React.FC<ChatPros> = ({ message, senderUUID, timestamps }) => {
  const cookies = parseCookies();
  const uuid = cookies["uuid"];
  const [senderAvt, setSenderAvt] = useState();
  const [receiverAvt, setReceiverAvt] = useState();
  const fetchSenderProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-user-uuid/${uuid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setSenderAvt(data.data.avatar);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const fetchReceiverProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/profile/get-profile-by-user-uuid/${senderUUID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setReceiverAvt(data.data.avatar);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchSenderProfile();
    fetchReceiverProfile();
  }, [senderUUID]);

  return (
    <ChatStyle>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {senderUUID === uuid ? (
          <SenderStyle>
            <Typography variant="body1" style={{ marginRight: 5 }}>
              {fToNow(convertToDate(timestamps.toString()))}
            </Typography>
            <SenderMessageDisplayStyle>
              <Typography variant="subtitle1">{message}</Typography>
            </SenderMessageDisplayStyle>
            <IconButtonStyles
              style={{ marginRight: "0px", marginLeft: "20px" }}
            >
              <Avatar src={senderAvt} alt="photoURL" />
            </IconButtonStyles>
          </SenderStyle>
        ) : (
          <ReceiveStyle>
            <IconButtonStyles>
              <Avatar src={receiverAvt} alt="photoURL" />
            </IconButtonStyles>
            <ReceiverMessageDisplayStyle>
              <Typography variant="subtitle1">{message}</Typography>
            </ReceiverMessageDisplayStyle>
            <Typography variant="body1" style={{ marginLeft: 5 }}>
              {fToNow(convertToDate(timestamps.toString()))}
            </Typography>
          </ReceiveStyle>
        )}
      </Box>
    </ChatStyle>
  );
};

export default LineChat;
