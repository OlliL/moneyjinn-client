import { StoreService } from "@/stores/StoreService";
import { Client, StompSubscription } from "@stomp/stompjs";
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
    const headers = {} as Record<string, string>;
    HeaderUtil.getInstance().addAuthorizationHeader(headers);
    HeaderUtil.getInstance().addCsrfHeader(headers);

    this.stompClient = new Client({
      brokerURL: url,
      connectHeaders: headers,
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 1000,
    });

    this.stompClient.onConnect = function () {
      StoreService.getInstance().subscribeAllStores();
    };

    this.stompClient.activate();
  }

  public disconnectStompClient() {
    this.stompClient.deactivate();
  }

  public subscribe(
    destination: string,
    callback: (body: string) => any
  ): StompSubscription {
    const headers = {} as Record<string, string>;
    HeaderUtil.getInstance().addCsrfHeader(headers);

    return this.stompClient.subscribe(
      destination,
      (message) => {
        callback(message.body);
      },
      headers
    );
  }
}
