import { useUserSessionStore } from "@/stores/UserSessionStore";

abstract class AbstractControllerHandler {
  private static SERVER_ROOT = "http://localhost:8081/moneyflow/server/";

  protected async post(
    requestBody: any,
    controller: string,
    usecase: string
  ): Promise<Response> {
    const userSessionStore = useUserSessionStore();
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
    if (userSessionStore.getAuthorizationToken.length > 0) {
      requestInfo.headers.append(
        "Authentication",
        "Bearer " + userSessionStore.getAuthorizationToken
      );
    }
    const response = await fetch(requestInfo);
    return response;
  }

  protected async get(controller: string, usecase: string): Promise<Response> {
    const userSessionStore = useUserSessionStore();
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + controller + "/" + usecase,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (userSessionStore.getAuthorizationToken.length > 0) {
      requestInfo.headers.append(
        "Authorization",
        "Bearer " + userSessionStore.getAuthorizationToken
      );
    }
    const response = await fetch(requestInfo);
    return response;
  }
}

export default AbstractControllerHandler;
