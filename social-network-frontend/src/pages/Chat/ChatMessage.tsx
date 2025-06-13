import { Box, styled } from "@mui/material";
import ChatArea from "../../components/App/Chat/ChatArea";
import ListUserConnection from "../../components/App/Chat/ListUserConnect";

export const ChatComponentStyle = styled(Box)({
  display: "flex",
  width: "100%",
});

const ChatMessage = () => {
  return (
    <ChatComponentStyle>
      <ListUserConnection />
      <ChatArea />
    </ChatComponentStyle>
  );
};
export default ChatMessage;
