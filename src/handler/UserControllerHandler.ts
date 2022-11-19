import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { ErrorCode } from "@/model/ErrorCode";
import { LoginRequest } from "@/model/rest/LoginRequest";
import type { LoginResponse } from "@/model/rest/LoginResponse";
import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";

class UserControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "user";

  async login(username: string, password: string) {
    const loginRequest = new LoginRequest(username, password);
    const userSessionStore = useUserSessionStore();

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
    console.log(loginResponse);
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
    };

    userSessionStore.setUserSession(userSession);
  }
}

export default new UserControllerHandler();
