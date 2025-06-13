// index.tsx
import { useState, useRef, useEffect } from "react";
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
import { NotificationType } from "./type";
import { notificationItemStyle, iconButtonStyle, popoverStyle } from "./styles";
import { fToNow, convertToDate } from "../../../utils/formatTime";
import Iconify from "../Common/Iconify/Iconify";
import Scrollbar from "../Common/Scrollbar/Scrollbar";
import MenuPopover from "../Common/MenuPopover/MenuPopover";
import { noCase } from "change-case";
import { useTranslation } from "react-i18next";
// import NOTIFICATIONS from "../../../_mock/notifications";
import SocketService from "../../../helper/SocketService";
import { parseCookies } from "nookies";
import { SOCKET_URL } from "../../../Path/backend";
import { useDispatch, useSelector } from "react-redux";
import { notificationStore } from "../../../store/reducers";

export default function NotificationsPopover() {
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const notifications =
    useSelector(notificationStore.selectNotificationList) || [];
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const totalUnRead = notifications.filter((item) => item.unread).length || 0;
  const dispatch = useDispatch();
  const cookies = parseCookies();
  const token = cookies["accessToken"];
  const privateTopic = `/user/${cookies["uuid"]}/queue/private`;
  const broadcastTopic = "/topic/broadcast";

  useEffect(() => {
    dispatch(notificationStore.sagaGetList());
    SocketService.connect(
      SOCKET_URL,
      [
        {
          topic: privateTopic,
          callback: (notification) => handleNewNotification(notification),
        },
        {
          topic: broadcastTopic,
          callback: (notification) => handleNewNotification(notification),
        },
      ],
      token
    );

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const handleNewNotification = (notification: string) => {
    try {
      const parsedNotification = JSON.parse(notification);
      dispatch(notificationStore.actions.addNotification(parsedNotification));
    } catch (error) {
      console.error("Failed to parse notification:", error);
    }
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      unread: false,
    }));
    dispatch(
      notificationStore.actions.setNotificationList(updatedNotifications)
    );
    // mark all ass read
    dispatch(notificationStore.sagaMarkAsRead());
  };

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? "primary" : "default"}
        onClick={handleOpen}
        sx={iconButtonStyle}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={popoverStyle}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              {t("notification.title")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {t("notification.youhave")} {totalUnRead}{" "}
              {t("notification.unread")}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 400 } }}>
          <List disablePadding>
            {notifications.slice(0, visibleCount).map((notification) => (
              <NotificationItem
                key={notification.uuid}
                notification={notification}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Box sx={{ p: 1 }}>
          {visibleCount < notifications.length && (
            <Button fullWidth disableRipple onClick={handleViewMore}>
              View All
            </Button>
          )}
        </Box>
      </MenuPopover>
    </>
  );
}

// NotificationItem component
type NotificationItemProps = {
  notification: NotificationType;
};

function NotificationItem({ notification }: NotificationItemProps) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton sx={notificationItemStyle(notification.unread)}>
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify
              icon="eva:clock-outline"
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {fToNow(convertToDate(notification.createdAt.toString()))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// Helper function to render content
function renderContent(notification: NotificationType) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary" }}
      >
        &nbsp; {noCase(notification.message)}
      </Typography>
    </Typography>
  );

  let avatar;

  switch (notification.type) {
    case "ORDER_PLACED":
      avatar = (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_package.svg"
        />
      );
      break;

    case "ORDER_SHIPPED":
      avatar = (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_shipping.svg"
        />
      );
      break;

    case "MAIL":
      avatar = (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_mail.svg"
        />
      );
      break;

    case "FRIEND_INTERACTIVE":
      avatar = (
        <img
          alt={notification.title}
          src="/static/icons/ic_notification_chat.svg"
        />
      );
      break;

    default:
      avatar = notification.imagesUrl ? (
        <img alt={notification.title} src={notification.imagesUrl} />
      ) : null;
  }

  return {
    avatar,
    title,
  };
}
