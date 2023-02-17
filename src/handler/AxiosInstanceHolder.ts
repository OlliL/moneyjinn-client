import type { LoginResponse } from "@/api";
import { throwError } from "@/tools/views/ThrowError";
import type { AxiosInstance } from "axios";
import axios from "axios";
import {
  applyAuthTokenInterceptor,
  type IAuthTokens,
  type TokenRefreshRequest,
} from "axios-jwt";
import type { Token } from "axios-jwt/dist/src/Token";
import { WebServer } from "./WebServer";

export class AxiosInstanceHolder {
  private static instance: AxiosInstanceHolder;
  private axiosInstance: AxiosInstance = {} as AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstanceHolder {
    if (!AxiosInstanceHolder.instance) {
      AxiosInstanceHolder.instance = new AxiosInstanceHolder();

      AxiosInstanceHolder.instance.axiosInstance = axios.create({
        baseURL: AxiosInstanceHolder.instance.getWebRoot(),
        withCredentials: true,
      });

      const requestRefresh: TokenRefreshRequest = async (
        refreshToken: Token
      ) => {
        return AxiosInstanceHolder.instance
          .refreshAuthToken(refreshToken)
          .then((response) => {
            return response;
          });
      };

      applyAuthTokenInterceptor(AxiosInstanceHolder.instance.axiosInstance, {
        requestRefresh,
      });
    }
    return AxiosInstanceHolder.instance;
  }

  private getWebRoot(): string {
    return "http://" + WebServer.getInstance().getWebServer();
  }

  public async refreshAuthToken(refreshToken: Token): Promise<IAuthTokens> {
    const headers = {} as Record<string, string>;
    headers["Authorization"] = "Bearer " + refreshToken;

    const requestInfo = new Request(
      this.getWebRoot() + "/moneyflow/server/user/refreshToken",
      {
        method: "get",
        headers: headers,
        credentials: "include",
      }
    );

    const response = await fetch(requestInfo);
    const loginResponse = (await response.json()) as LoginResponse;

    if (loginResponse.code) {
      throwError(loginResponse.code);
    }

    return {
      accessToken: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
    };
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
