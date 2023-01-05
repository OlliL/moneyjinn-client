import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import type { SupplierCsrfToken } from "@/model/SupplierCsrfToken";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";
import WebServer from "./WebServer";

abstract class AbstractControllerHandler {
  private async getHeadersWithCsrf() {
    const userSessionStore = useUserSessionStore();
    const csrfToken = userSessionStore.csrfToken;

    const newHeaders: HeadersInit = {
      ...this.getHeaders(),
      "X-CSRF-TOKEN": csrfToken,
    };
    return newHeaders;
  }

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

  private getWebRoot(): String {
    return "http://" + WebServer.getWebServer() + "/moneyflow/server/";
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
      this.getWebRoot() + controller + "/" + usecase,
      {
        method: httpMethod,
        body: JSON.stringify(requestBody),
        headers: await this.getHeadersWithCsrf(),
        credentials: "include",
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
      this.getWebRoot() + controller + "/" + usecase,
      {
        method: httpMethod,
        headers:
          httpMethod === "delete"
            ? await this.getHeadersWithCsrf()
            : await this.getHeaders(),
        credentials: "include",
      }
    );

    const response = await fetch(requestInfo);
    return response;
  }

  protected async retrieveAndStoreCsrfToken() {
    const requestInfo = new Request(this.getWebRoot() + "csrf/csrf", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const csrfResponse = await fetch(requestInfo);

    if (!csrfResponse.ok) {
      throw new Error(csrfResponse.statusText);
    }
    const userSessionStore = useUserSessionStore();
    const supplierCsrfToken = (await csrfResponse.json()) as SupplierCsrfToken;
    userSessionStore.setCsrfToken(supplierCsrfToken.SupplierCsrfToken.token);
  }

  private async refreshAuthToken() {
    const userSessionStore = useUserSessionStore();

    if (userSessionStore.getRefreshToken.length === 0) return;

    const requestInfo = new Request(this.getWebRoot() + "user/refreshToken", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
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

    this.retrieveAndStoreCsrfToken();
  }
}

export default AbstractControllerHandler;
