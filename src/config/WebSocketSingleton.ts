import { StoreService } from "@/stores/StoreService";
import { Client, type StompSubscription } from "@stomp/stompjs";
import { HeaderUtil } from "../service/util/HeaderUtil";
import { webServerHost, webServerProtocol } from "./WebServerConfiguration";

export class WebSocketSingleton {
  private static instance: WebSocketSingleton;
  private stompClient: Client = {} as Client;

  private constructor() {}

  public static getInstance(): WebSocketSingleton {
    if (!WebSocketSingleton.instance) {
      WebSocketSingleton.instance = new WebSocketSingleton();
    }
    return WebSocketSingleton.instance;
  }

  public async connectStompClient() {
    const webSocketProtocol = webServerProtocol.replace("http", "ws");
    const url = webSocketProtocol + "//" + webServerHost + "/websocket";

    this.stompClient = new Client({
      brokerURL: url,
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 1000,
    });

    this.stompClient.beforeConnect = async () => {
      const headers = {} as Record<string, string>;
      await HeaderUtil.getInstance().addAuthorizationHeader(headers);
      HeaderUtil.getInstance().addXsrfHeader(headers);
      this.stompClient.connectHeaders = headers;
    };

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
    callback: (body: string) => any,
  ): StompSubscription {
    return this.stompClient.subscribe(destination, (message) => {
      callback(message.body);
    });
  }
}
