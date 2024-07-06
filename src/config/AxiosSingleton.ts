import type { ErrorResponse, LoginResponse, ValidationResponse } from "@/api";
import { BackendError, BackendErrorType } from "@/model/BackendError";
import { ErrorCode } from "@/model/ErrorCode";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { AxiosInstance } from "axios";
import axios from "axios";
import {
  applyAuthTokenInterceptor,
  type IAuthTokens,
  type TokenRefreshRequest,
} from "axios-jwt";
import type { Token } from "axios-jwt/dist/src/Token";
import { mapValidationItemTransportToModel } from "../handler/mapper/ValidationItemTransportMapper";
import { webServerHost } from "./WebServerConfiguration";
import I18nSingleton from "./I18nSingleton";

function getWebRoot(): string {
  return "http://" + webServerHost;
}

async function refreshAuthToken(refreshToken: Token): Promise<IAuthTokens> {
  const headers = {} as Record<string, string>;
  headers["Authorization"] = "Bearer " + refreshToken;

  const requestInfo = new Request(
    getWebRoot() + "/moneyflow/server/user/refreshToken",
    {
      method: "get",
      headers: headers,
      credentials: "include",
    },
  );

  const response = await fetch(requestInfo);
  const loginResponse = (await response.json()) as LoginResponse;

  return {
    accessToken: loginResponse.token,
    refreshToken: loginResponse.refreshToken,
  };
}

function createHttpInstance(): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: getWebRoot(),
    withCredentials: true,
  });

  const requestRefresh: TokenRefreshRequest = async (refreshToken: Token) => {
    return refreshAuthToken(refreshToken).then((response) => {
      return response;
    });
  };

  applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error instanceof Error && !("response" in error)) {
        throw new BackendError(
          BackendErrorType.ERROR,
          undefined,
          I18nSingleton.t()("ErrorMessage.technicalError"),
        );
      }

      if (error.response.status === 400) {
        const errorResponse: ErrorResponse = error.response.data;
        throw new BackendError(
          BackendErrorType.CLIENT_ERROR,
          errorResponse.code,
        );
      } else if (error.response.status === 403) {
        throw new BackendError(
          BackendErrorType.AUTH_ERROR,
          ErrorCode.USERNAME_PASSWORD_WRONG.valueOf(),
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

        throw new BackendError(
          BackendErrorType.VALIDATION_ERROR,
          undefined,
          undefined,
          validationResult,
        );
      }
      throw new BackendError(
        BackendErrorType.ERROR,
        undefined,
        I18nSingleton.t()("ErrorMessage.technicalError", {
          status: error.response.status,
          statusText: error.response.statusText,
        }),
      );
    },
  );
  return axiosInstance;
}

export const http: AxiosInstance = createHttpInstance();
