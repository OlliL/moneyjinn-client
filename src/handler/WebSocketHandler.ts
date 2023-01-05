import { useContractpartnerStore } from "@/stores/ContractpartnerStore";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import Stomp, {
  Client,
  type ConnectionHeaders,
  type Message,
  type SubscribeHeaders,
  type Subscription,
} from "webstomp-client";

class WebSocketHandler {
  private stompClient: Client = {} as Client;

  public async connectStompClient(url: string) {
    const userSessionStore = useUserSessionStore();
    const token = userSessionStore.getAuthorizationToken;
    const csrfToken = userSessionStore.csrfToken;

    this.stompClient = Stomp.client(url, {
      debug: true,
      protocols: Stomp.VERSIONS.supportedProtocols(),
    });
    const headers: ConnectionHeaders = { Authorization: "Bearer " + token };
    headers["X-CSRF-TOKEN"] = csrfToken;

    this.stompClient.connect(headers, () => {
      const contractpartnerStore = useContractpartnerStore();
      contractpartnerStore.subscribeToWebsocket();
    });
  }

  public disconnectStompClient() {
    this.stompClient.disconnect();
  }

  public subscribe(
    destination: string,
    callback?: (message: Message) => any,
    headers?: SubscribeHeaders
  ): Subscription {
    const userSessionStore = useUserSessionStore();
    const csrfToken = userSessionStore.csrfToken;

    const privateHeaders: SubscribeHeaders = {
      ...headers,
      "X-CSRF-TOKEN": csrfToken,
    };
    return this.stompClient.subscribe(destination, callback, privateHeaders);
  }
}
export default new WebSocketHandler();
