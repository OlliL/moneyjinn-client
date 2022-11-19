import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { LoginRequest } from "@/model/rest/LoginRequest";
import type { LoginResponse } from "@/model/rest/LoginResponse";

class UserControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "user";

  async login(username: string, password: string): Promise<boolean> {
    const loginRequest = new LoginRequest(username, password);

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

    console.log(loginResponse.loginResponse.token);

    //TODO: Store in pinia
    return true;
  }
}

export default new UserControllerHandler();
