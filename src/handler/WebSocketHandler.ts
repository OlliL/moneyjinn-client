import { StoreService } from "@/stores/StoreService";
import Stomp, { Client, type Subscription } from "webstomp-client";
import { HeaderUtil } from "./util/HeaderUtil";
import { WebServer } from "./WebServer";

export class WebSocketHandler {
  private static instance: WebSocketHandler;
  private stompClient: Client = {} as Client;

  private constructor() {}

  public static getInstance(): WebSocketHandler {
    if (!WebSocketHandler.instance) {
      WebSocketHandler.instance = new WebSocketHandler();
    }
    return WebSocketHandler.instance;
  }

  public async connectStompClient() {
    const url = "ws://" + WebServer.getInstance().getWebServer() + "/websocket";

    this.stompClient = Stomp.client(url, {
      debug: true,
      protocols: Stomp.VERSIONS.supportedProtocols(),
    });

    const headers = {} as Record<string, string>;
    HeaderUtil.getInstance().addAuthorizationHeader(headers);
    HeaderUtil.getInstance().addCsrfHeader(headers);

    this.stompClient.connect(headers, () => {
      StoreService.getInstance().subscribeAllStores();
    });
  }

  public disconnectStompClient() {
    this.stompClient.disconnect();
  }

  public subscribe(
    destination: string,
    callback?: (body: string) => any,
    headers?: Record<string, string>
  ): Subscription {
    const privateHeaders = { ...headers } as Record<string, string>;
    HeaderUtil.getInstance().addCsrfHeader(privateHeaders);
    return this.stompClient.subscribe(
      destination,
      (message) => {
        if (callback) callback(message.body);
      },
      privateHeaders
    );
  }
}
