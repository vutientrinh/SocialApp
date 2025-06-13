import { Client, Frame, Message, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type NotificationCallback = (message: string) => void;

class SocketService {
  private client: Client | null = null;
  private subscriptions: StompSubscription[] = [];

  public connect(
    url: string,
    topics: { topic: string; callback: NotificationCallback }[],
    token: string
  ): void {
    const socket = new SockJS(url);
    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        //console.log(str);
      },
      onConnect: (frame: Frame) => {
        //console.log("Connected: " + frame);

        // Subscribe to each topic in the array
        topics.forEach(({ topic, callback }) => {
          const subscription = this.client?.subscribe(
            topic,
            (notification: Message) => {
              callback(notification.body);
            }
          );
          if (subscription) {
            this.subscriptions.push(subscription);
          }
        });
      },
      onStompError: (frame: Frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    this.client.activate();
  }

  public sendBroadcast(destination: string, body: object): void {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    }
  }

  public sendPrivate(uuid: string, destination: string, body: object): void {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: `${destination}/${uuid}`,
        body: JSON.stringify(body),
      });
    }
  }

  public sendChat(destination: string, body: object): void {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    }
  }

  public disconnect(): void {
    if (this.client) {
      // Unsubscribe from all subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions = [];
      this.client.deactivate();
    }
  }
}

const socketService = new SocketService();

export default socketService;
