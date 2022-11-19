abstract class AbstractControllerHandler {
  private static SERVER_ROOT = "http://localhost:8080/moneyflow/server/";

  protected async post(
    requestBody: any,
    controller: string,
    usecase: string
  ): Promise<Response> {
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + controller + "/" + usecase,
      {
        method: "post",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const response = await fetch(requestInfo);
    return response;
  }
}

export default AbstractControllerHandler;
