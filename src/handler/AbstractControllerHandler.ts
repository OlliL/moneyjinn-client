import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import type { SupplierCsrfToken } from "@/model/SupplierCsrfToken";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";
import { HeaderUtil } from "./util/HeaderUtil";
import { WebServer } from "./WebServer";

abstract class AbstractControllerHandler {
  private static NO_CSRF_METHODS: Array<string> = [
    "GET",
    "HEAD",
    "TRACE",
    "OPTIONS",
  ];

  private getWebRoot(): String {
    return (
      "http://" + WebServer.getInstance().getWebServer() + "/moneyflow/server/"
    );
  }
  protected async post(
    requestBody: any,
    controller: string,
    usecase: string
  ): Promise<Response> {
    let response = await this.internalFetch(
      controller,
      usecase,
      "post",
      requestBody
    );
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalFetch(
        controller,
        usecase,
        "post",
        requestBody
      );
    }
    return response;
  }

  protected async put(
    requestBody: any,
    controller: string,
    usecase: string
  ): Promise<Response> {
    let response = await this.internalFetch(
      controller,
      usecase,
      "put",
      requestBody
    );
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalFetch(
        controller,
        usecase,
        "put",
        requestBody
      );
    }
    return response;
  }

  protected async get(controller: string, usecase: string): Promise<Response> {
    let response = await this.internalFetch(controller, usecase, "get");
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalFetch(controller, usecase, "get");
    }
    return response;
  }

  protected async delete(
    controller: string,
    usecase: string
  ): Promise<Response> {
    let response = await this.internalFetch(controller, usecase, "delete");
    if ((await response.status) === 403) {
      await this.refreshAuthToken();
      response = await this.internalFetch(controller, usecase, "delete");
    }
    return response;
  }

  private async internalFetch(
    controller: string,
    usecase: string,
    httpMethod: string,
    requestBody?: any
  ): Promise<Response> {
    const requestInit: RequestInit = {
      method: httpMethod,
      credentials: "include",
    };

    if (requestBody) requestInit["body"] = JSON.stringify(requestBody);

    const headers = {} as Record<string, string>;
    HeaderUtil.getInstance().addContentTypeJson(headers);
    HeaderUtil.getInstance().addAuthorizationHeader(headers);

    if (
      !AbstractControllerHandler.NO_CSRF_METHODS.includes(
        httpMethod.toUpperCase()
      )
    ) {
      HeaderUtil.getInstance().addCsrfHeader(headers);
    }
    requestInit["headers"] = headers;

    const requestInfo = new Request(
      this.getWebRoot() + controller + "/" + usecase,
      requestInit
    );

    const response = await fetch(requestInfo);
    return response;
  }

  protected async retrieveAndStoreCsrfToken() {
    const headers = {} as Record<string, string>;
    HeaderUtil.getInstance().addCsrfHeader(headers);

    const requestInfo = new Request(this.getWebRoot() + "csrf/csrf", {
      method: "get",
      headers: headers,
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

    const headers = {} as Record<string, string>;
    HeaderUtil.getInstance().addCsrfHeader(headers);
    headers["Authorization"] = "Bearer " + userSessionStore.getRefreshToken;

    const requestInfo = new Request(this.getWebRoot() + "user/refreshToken", {
      method: "get",
      headers: headers,
      credentials: "include",
    });

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
