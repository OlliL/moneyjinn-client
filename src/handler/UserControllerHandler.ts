import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { LoginRequest } from "@/model/rest/LoginRequest";
import type { LoginResponse } from "@/model/rest/LoginResponse";
import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";

class UserControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "user";

  async login(username: string, password: string): Promise<boolean> {
    const loginRequest = new LoginRequest(username, password);
    const userSessionStore = useUserSessionStore();

    const response = await super.post(
      loginRequest,
      UserControllerHandler.CONTROLLER,
      "login"
    );
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Der angegebene Benutzername oder das Passwort sind falsch!"
        );
      }
      throw new Error(response.statusText);
    }

    const loginResponse = (await response.json()) as LoginResponse;
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

    return true;
  }
}

export default new UserControllerHandler();
