import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";

abstract class AbstractControllerHandler {
  private static SERVER_ROOT = "http://10.0.1.51:8080/moneyflow/server/";

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
    let response = await this.internalWithBody(
      requestBody,
      controller,
      usecase,
      "post"
    );
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalWithBody(
        requestBody,
        controller,
        usecase,
        "post"
      );
    }
    return response;
  }

  protected async put(
    requestBody: any,
    controller: string,
    usecase: string
  ): Promise<Response> {
    let response = await this.internalWithBody(
      requestBody,
      controller,
      usecase,
      "put"
    );
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalWithBody(
        requestBody,
        controller,
        usecase,
        "put"
      );
    }
    return response;
  }

  protected async get(controller: string, usecase: string): Promise<Response> {
    let response = await this.internalWithoutBody(controller, usecase, "get");
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalWithoutBody(controller, usecase, "get");
    }
    return response;
  }

  protected async delete(
    controller: string,
    usecase: string
  ): Promise<Response> {
    let response = await this.internalWithoutBody(
      controller,
      usecase,
      "delete"
    );
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalWithoutBody(controller, usecase, "delete");
    }
    return response;
  }

  private async internalWithBody(
    requestBody: any,
    controller: string,
    usecase: string,
    httpMethod: string
  ) {
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + controller + "/" + usecase,
      {
        method: httpMethod,
        body: JSON.stringify(requestBody),
        headers: this.getHeaders(),
      }
    );

    const response = await fetch(requestInfo);
    return response;
  }

  private async internalWithoutBody(
    controller: string,
    usecase: string,
    httpMethod: string
  ): Promise<Response> {
    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + controller + "/" + usecase,
      {
        method: httpMethod,
        headers: this.getHeaders(),
      }
    );

    const response = await fetch(requestInfo);
    return response;
  }

  private async refreshAuthToken() {
    const userSessionStore = useUserSessionStore();

    if (userSessionStore.getRefreshToken.length === 0) return;

    const requestInfo = new Request(
      AbstractControllerHandler.SERVER_ROOT + "user" + "/" + "refreshToken",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    requestInfo.headers.append(
      "Authorization",
      "Bearer " + userSessionStore.getRefreshToken
    );
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
