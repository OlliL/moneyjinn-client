export class WebServer {
  private static instance: WebServer;
  private webServer: string = "";

  private constructor() {}

  public static getInstance(): WebServer {
    if (!WebServer.instance) {
      WebServer.instance = new WebServer();
      WebServer.instance.webServer = location.host;
    }
    return WebServer.instance;
  }

  public setWebServer(url: string) {
    this.webServer = url;
  }

  public getWebServer(): string {
    return this.webServer;
  }
}
