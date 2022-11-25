import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";

abstract class AbstractControllerHandler {
  private static SERVER_ROOT = "http://localhost:8081/moneyflow/server/";

  private getHeaders(): HeadersInit {
    const userSessionStore = useUserSessionStore();
    const headersInit: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (userSessionStore.getAuthorizationToken.length > 0) {
      headersInit["Authorization"] =
        "Bearer " + userSessionStore.getAuthorizationToken;
    }
    return headersInit;
  }

  protected async post(
    requestBody: any,
    controller: string,
    usecase: string
  ): Promise<Response> {
    let response = await this.internalPost(requestBody, controller, usecase);
    if ((await response.status) === 403) {
      this.refreshAuthToken();
      response = await this.internalPost(requestBody, controller, usecase);
    }
    return response;
  }

  protected async get(controller: string, usecase: string): Promise<Response> {
    let response = await this.internalGet(controller, usecase);
    if ((await response.status) === 403) {
      this.refreshAuthToken();
      response = await this.internalGet(controller, usecase);
    }
    return response;
  }

  private async internalPost(
    requestBody: any,
    controller: string,
    usecase: string
  ) {
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + controller + "/" + usecase,
      {
        method: "post",
        body: JSON.stringify(requestBody),
        headers: this.getHeaders(),
      }
    );

    const response = await fetch(requestInfo);
    return response;
  }

  private async internalGet(
    controller: string,
    usecase: string
  ): Promise<Response> {
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + controller + "/" + usecase,
      {
        method: "get",
        headers: this.getHeaders(),
      }
    );

    const response = await fetch(requestInfo);
    return response;
  }

  private async refreshAuthToken() {
    const userSessionStore = useUserSessionStore();
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + "user" + "/" + "refreshToken",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (userSessionStore.getRefreshToken.length > 0) {
      requestInfo.headers.append(
        "Authorization",
        "Bearer " + userSessionStore.getRefreshToken
      );
    }
    const response = await fetch(requestInfo);
    const loginResponse = (await response.json()) as LoginResponse;

    if (loginResponse.error) {
      throwError(loginResponse.error.code);
    }
    const innerLoginResponse = loginResponse.loginResponse;
    userSessionStore.setAuthorizationToken(innerLoginResponse.token);
    userSessionStore.setRefreshToken(innerLoginResponse.refreshToken);
  }
}

export default AbstractControllerHandler;
