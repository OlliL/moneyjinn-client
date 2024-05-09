export class WebServer {
  private static instance: WebServer;
  private webServer: string;

  private constructor(host: string) {
    this.webServer = host;
  }

  public static getInstance(): WebServer {
    if (!WebServer.instance) {
      WebServer.instance = new WebServer(location.host);
    }
    return WebServer.instance;
  }

  public getWebServer(): string {
    return this.webServer;
  }
}
