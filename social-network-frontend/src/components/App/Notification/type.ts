export type NotificationType = {
  uuid: string;
  title: string;
  message: string;
  imagesUrl: string | null;
  type:
    | "ORDER_PLACED"
    | "FRIEND_INTERACTIVE"
    | "CHAT_MESSAGE"
    | "MAIL"
    | "ORDER_SHIPPED"
    | "FRIEND_REQUEST"
    | "PROFILE_UPDATE"
    | "ORDER_DELIVERED"
    | "SYSTEM_ALERT"
    | "PROMOTION"
    | "PAYMENT";
  createdAt: Date;
  unread: boolean;
};
