import type { ErrorResponse, LoginResponse, ValidationResponse } from "@/api";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import { ErrorCode } from "@/model/ErrorCode";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import type { AxiosInstance } from "axios";
import axios from "axios";
import {
  applyAuthTokenInterceptor,
  type IAuthTokens,
  type TokenRefreshRequest,
} from "axios-jwt";
import type { Token } from "axios-jwt/dist/src/Token";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
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
          return response;
        },
        (error) => {
          if (error.response.status === 400) {
            const errorResponse: ErrorResponse = error.response.data;
            return Promise.reject(
              new BackendError(
                BackendErrorType.CLIENT_ERROR,
                errorResponse.code
              )
            );
          } else if (error.response.status === 403) {
            return Promise.reject(
              new BackendError(
                BackendErrorType.AUTH_ERROR,
                ErrorCode.USERNAME_PASSWORD_WRONG.valueOf()
              )
            );
          } else if (error.response.status === 422) {
            const validationResponse: ValidationResponse = error.response.data;
            const validationResult: ValidationResult = {
              result: validationResponse.result,
              validationResultItems:
                validationResponse.validationItemTransports?.map((vit) => {
                  return mapValidationItemTransportToModel(vit);
                }),
            };

            return Promise.reject(
              new BackendError(
                BackendErrorType.VALIDATION_ERROR,
                undefined,
                undefined,
                validationResult
              )
            );
          }
          return Promise.reject(
            new BackendError(
              BackendErrorType.ERROR,
              undefined,
              "Technischer Fehler: (" +
                error.response.status +
                ") " +
                error.response.statusText
            )
          );
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

    // TODO: mmmmh.... that looks wrong
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
