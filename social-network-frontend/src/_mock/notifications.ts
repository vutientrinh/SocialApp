import { set, sub } from "date-fns";
import { faker } from "@faker-js/faker";
import { NotificationType } from "../components/App/Notification/type";

const NOTIFICATIONS: NotificationType[] = [
  {
    uuid: faker.string.uuid(),
    title: "Your order is placed",
    message: "waiting for shipping",
    imagesUrl: null,
    type: "ORDER_PLACED",
    createdAt: set(new Date(), { hours: 10, minutes: 30 }),
    unread: true,
  },
];

export default NOTIFICATIONS;
