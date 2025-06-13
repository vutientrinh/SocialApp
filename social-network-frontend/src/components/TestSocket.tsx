import { parseCookies } from "nookies";
import React, { useEffect, useState } from "react";
import SocketService from "../helper/SocketService";
import { SOCKET_URL } from "../Path/backend";

const TestSocket: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [imagesUrl, setImagesUrl] = useState<string>("");
  const [type, setType] = useState<string>("CHAT_MESSAGE");

  useEffect(() => {
    const socketUrl = SOCKET_URL;
    const cookies = parseCookies();
    const token = cookies["accessToken"];
    const privateTopic = `/user/${cookies["uuid"]}/queue/private`;
    const broadcastTopic = "/topic/broadcast";

    SocketService.connect(
      socketUrl,
      [
        {
          topic: privateTopic,
          callback: (notification) => {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              notification,
            ]);
          },
        },
        {
          topic: broadcastTopic,
          callback: (notification) => {
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              notification,
            ]);
          },
        },
      ],
      token
    );

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const sendNotification = () => {
    const notification = {
      title,
      message,
      imagesUrl,
      type,
      createdAt: new Date().toISOString(),
      unread: true,
    };

    const cookies = parseCookies();
    const PayloadSocket = {
      uuid: cookies["uuid"],
    };
    //SocketService.sendPrivate(cookies["uuid"], "/app/private", notification);
    SocketService.sendPrivate(
      "56e1d3a9-9c81-4c76-a822-ba4925ef127e",
      "/app/private",
      notification
    );
    //console.log("PayloadSocket", PayloadSocket);
    //SocketService.sendBroadcast("/app/broadcast", PayloadSocket);
  };

  return (
    <div id="notifications">
      <h1>Notifications</h1>
      {notifications.map((notification, index) => (
        <p key={index}>{notification}</p>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendNotification();
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Images URL"
          value={imagesUrl}
          onChange={(e) => setImagesUrl(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="CHAT_MESSAGE">CHAT_MESSAGE</option>
          <option value="FRIEND_INTERACTIVE">FRIEND_INTERACTIVE</option>
          <option value="ORDER_SHIPPED">ORDER_SHIPPED</option>
          <option value="PROMOTION">PROMOTION</option>
          <option value="PAYMENT">PAYMENT</option>
          <option value="MAIL">MAIL</option>
          <option value="SYSTEM_ALERT">SYSTEM_ALERT</option>
          <option value="ORDER_PLACED">ORDER_PLACED</option>
          <option value="PROFILE_UPDATE">PROFILE_UPDATE</option>
          <option value="ORDER_DELIVERED">ORDER_DELIVERED</option>
          <option value="FRIEND_REQUEST">FRIEND_REQUEST</option>
        </select>
        <button type="submit">Send Notification</button>
      </form>
    </div>
  );
};

export default TestSocket;
