class WebServer {
  private webServer: String = "";

  public setWebServer(url: String) {
    this.webServer = url;
  }

  public getWebServer(): String {
    return this.webServer;
  }
}

export default new WebServer();
