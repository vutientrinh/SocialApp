import { Client, Stomp } from "@stomp/stompjs";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { chatStore, userStore } from "../store/reducers";

// import { SOCKET_URL } from "../Path/backend";

const TestChat = () => {
  let receiverUUID = "e4f33e10-d73d-416a-ae04-6f42c42c44f5";

  const cookies = parseCookies();
  const token = cookies["accessToken"];

  let uuid = cookies["uuid"];

  const [historyMessage, setHistoryMessage] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const SOCKET_URL = `${process.env.REACT_APP_BACKEND_URL}ws`;
  const dispatch = useDispatch();
  const userList = useSelector(userStore.selectUserList);
  const chatList = useSelector(chatStore.selectChatList);
  // const receiverUUID: string | null = useSelector(selectSelectedUserUUID);
  console.log("Sender ID : ", uuid);
  console.log("UserList : ", userList);
  console.log("ChatList : ", chatList);
  const fetchAndDisplayUserChat = async () => {
    try {
      // const response = await fetch(`/messages/${uuid}/${receiverUUID}`);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}api/chat/messages/${uuid}/${receiverUUID}`
      );
      console.log(response.json);
      if (response.ok) {
        const chatHistory = await response.json();
        setHistoryMessage(chatHistory);
        console.log("Chat history loaded:", historyMessage);
      } else {
        console.error("Failed to load chat history");
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };
  useEffect(() => {
    dispatch(
      chatStore.sagaGetList({ senderUUID: uuid, receiverUUID: receiverUUID })
    );
    const socket = new SockJS(SOCKET_URL);
    const stompClient = Stomp.over(socket);

    // Function to handle successful connection
    const onConnect = () => {
      console.log("Connected to WebSocket successfully.");

      // Subscribe to public channel
      stompClient.subscribe("/user/public", (message) => {
        const chatMessage = JSON.parse(message.body);
        setHistoryMessage((prevMessages) => [...prevMessages, chatMessage]);
      });

      // Subscribe to private channel for the receiver
      stompClient.subscribe(`/user/${uuid}/queue/messages`, (message) => {
        const chatMessage = JSON.parse(message.body);
        setHistoryMessage((prevMessages) => [...prevMessages, chatMessage]);
      });
    };

    // Connect with error handling
    stompClient.connect({}, onConnect);

    // Store the stompClient instance in state
    setStompClient(stompClient);
    stompClient.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate(); // Only deactivate when component unmounts
      }
    };
  }, [uuid, receiverUUID]);

  const sendMessage = async () => {
    if (stompClient && newMessage.trim()) {
      const chatMessage = {
        senderUUID: { uuid: uuid }, // Create a User object for sender
        receiverUUID: { uuid: receiverUUID }, // Create a User object for receiver
        threads: [
          {
            senderUUID: uuid,
            content: {
              message: newMessage, // Actual message text
            },
            timeStamps: new Date().toISOString(), // Current timestamp
          },
        ],
        lastUploadedAt: new Date().toISOString(),
      };

      console.log(chatMessage);
      stompClient.publish({
        destination: `/app/chat`,
        body: JSON.stringify(chatMessage),
      });
      setHistoryMessage((prevHistory) => [...prevHistory, chatMessage]);
      console.log("History chat ne : ", historyMessage);
    } else {
      console.error("STOMP client is not connected.");
    }
  };

  interface Thread {
    senderUUID: string;
    content: Content;
    timeStamps: string;
  }
  interface Content {
    message: String;
  }

  interface Message {
    senderUUID: string;
    receiverUUID: string;
    threads: Thread[]; // Optional chaining will work here
    lastUploadedAt: string;
  }
  console.log("History chat: ", historyMessage);

  const MessageItem: React.FC<{ message: Message }> = ({ message }) => (
    <div>
      {message.threads.map((threadItem, index) => (
        <p key={index}>
          Content: {threadItem.content.message}
          {message.senderUUID === uuid ? (
            <p style={{ fontSize: "20px" }}>Sender : {message.senderUUID}</p>
          ) : (
            <p style={{ color: "red" }}>Sender : {message.senderUUID}</p>
          )}
        </p>
      ))}
    </div>
  );

  return (
    <div>
      <h2>Chat Room</h2>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <button onClick={fetchAndDisplayUserChat}>Get user chat</button>
    </div>
  );
};

export default TestChat;
