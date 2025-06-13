import HttpService from "../helper/HttpService";

class NotificationApi extends HttpService {
  getNotificationList = (params: Record<string, any>) => {
    return this.getDataList<any>("api/msg/getNotifications", params);
  };
}

const notificationApi = new NotificationApi("");
export default notificationApi;
