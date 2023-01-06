import { devtools } from "vue";

export class WebServer {
  private static instance: WebServer;
  private webServer: String = "";

  private constructor() {}

  public static getInstance(): WebServer {
    if (!WebServer.instance) {
      WebServer.instance = new WebServer();
      WebServer.instance.webServer = location.host;
    }
    return WebServer.instance;
  }

  public setWebServer(url: String) {
    this.webServer = url;
  }

  public getWebServer(): String {
    return this.webServer;
  }
}
