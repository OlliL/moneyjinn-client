import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";
import type { AxiosResponse } from "axios";
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

  protected handleResponseError(response: AxiosResponse) {
    if (response.status === 204) {
      return;
    }

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    const errorResponse = response.data;
    if (errorResponse.code) {
      throwError(errorResponse.code);
    }
  }

  protected handleResponseErrorAsValidationResult(response: AxiosResponse) {
    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const errorResponse = response.data;
      const validationResultItem = {
        error: errorResponse.code,
      } as ValidationResultItem;
      validationResult.result = false;
      validationResult.validationResultItems = [validationResultItem];
    }
    return validationResult;
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
      HeaderUtil.getInstance().addXsrfHeader(headers);
    }

    requestInit["headers"] = headers;

    const requestInfo = new Request(
      this.getWebRoot() + controller + "/" + usecase,
      requestInit
    );

    const response = await fetch(requestInfo);
    return response;
  }

  protected async refreshAuthToken() {
    const userSessionStore = useUserSessionStore();

    if (userSessionStore.getRefreshToken.length === 0) return;

    const headers = {} as Record<string, string>;
    headers["Authorization"] = "Bearer " + userSessionStore.getRefreshToken;

    const requestInfo = new Request(this.getWebRoot() + "user/refreshToken", {
      method: "get",
      headers: headers,
      credentials: "include",
    });

    const response = await fetch(requestInfo);
    const loginResponse = (await response.json()) as LoginResponse;

    if (loginResponse.code) {
      throwError(loginResponse.code);
    }
    userSessionStore.setAuthorizationToken(loginResponse.token);
    userSessionStore.setRefreshToken(loginResponse.refreshToken);
  }
}

export default AbstractControllerHandler;
