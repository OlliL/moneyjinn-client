import { useUserSessionStore } from "@/stores/UserSessionStore";
import Stomp, {
  Client,
  type Message,
  type SubscribeHeaders,
  type Subscription,
} from "webstomp-client";

class WebSocketHandler {
  private stompClient: Client = {} as Client;

  public connectStompClient(url: string) {
    const userSessionStore = useUserSessionStore();
    const token = userSessionStore.getAuthorizationToken;

    this.stompClient = Stomp.over(new WebSocket(url + "?token=" + token), {
      debug: true,
      protocols: Stomp.VERSIONS.supportedProtocols(),
    });
    this.stompClient.connect({}, () => {});
  }

  public disconnectStompClient() {
    this.stompClient.disconnect();
  }

  public subscribe(
    destination: string,
    callback?: (message: Message) => any,
    headers?: SubscribeHeaders
  ): Subscription {
    return this.stompClient.subscribe(destination, callback, headers);
  }
}
export default new WebSocketHandler();
