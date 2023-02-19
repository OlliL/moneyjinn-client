import type { LoginResponse } from "@/api";
import { ErrorCode } from "@/model/ErrorCode";
import { getError, throwError } from "@/tools/views/ThrowError";
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

      AxiosInstanceHolder.instance.axiosInstance.interceptors.response.use(
        (response) => {
          if (response.status === 204) {
            return response;
          }

          if (response.status !== 200) {
            return Promise.reject(response.statusText);
          }

          const errorResponse = response.data;
          if (errorResponse.code) {
            return Promise.reject(getError(errorResponse.code));
          }

          return response;
        },
        (error) => {
          if (error.response.status === 403)
            return Promise.reject(getError(ErrorCode.USERNAME_PASSWORD_WRONG));
          return Promise.reject(error.response.statusText);
        }
      );
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
