import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { ErrorCode } from "@/model/ErrorCode";
import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { ChangePasswordRequest } from "@/model/rest/user/ChangePasswordRequest";
import { LoginRequest } from "@/model/rest/user/LoginRequest";
import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";

class UserControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "user";

  async login(username: string, password: string): Promise<void> {
    const loginRequest = new LoginRequest(username, password);
    const userSessionStore = useUserSessionStore();

    userSessionStore.logout();
    const response = await super.post(
      loginRequest,
      UserControllerHandler.CONTROLLER,
      "login"
    );
    if (!response.ok) {
      if (response.status === 403) {
        throwError(ErrorCode.USERNAME_PASSWORD_WRONG);
      }
      throw new Error(response.statusText);
    }

    const loginResponse = (await response.json()) as LoginResponse;

    if (loginResponse.error) {
      throwError(loginResponse.error.code);
    }
    const innerLoginResponse = loginResponse.loginResponse;
    const userTransport = innerLoginResponse.userTransport;

    const userSession: UserSession = {
      userId: userTransport.id,
      userName: userTransport.userName,
      userCanLogin: userTransport.userCanLogin === 1 ? true : false,
      userIsNew: userTransport.userIsNew === 1 ? true : false,
      userIsAdmin: userTransport.userIsAdmin === 1 ? true : false,
      userAuthorizationToken: innerLoginResponse.token,
      userRefreshToken: innerLoginResponse.refreshToken,
    };

    userSessionStore.setUserSession(userSession);
  }

  async changePassword(password: string) {
    const usecase = "changePassword";
    const request: ChangePasswordRequest = {
      changePasswordRequest: { password: password },
    };

    const response = await super.post(
      request,
      UserControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const errorResponse = (await response.json()) as ErrorResponse;

    if (errorResponse.error) {
      throwError(errorResponse.error.code);
    }
  }
}

export default new UserControllerHandler();
