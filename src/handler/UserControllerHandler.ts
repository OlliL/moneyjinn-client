import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { ErrorCode } from "@/model/ErrorCode";
import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { ChangePasswordRequest } from "@/model/rest/user/ChangePasswordRequest";
import type { CreateUserRequest } from "@/model/rest/user/CreateUserRequest";
import type { CreateUserResponse } from "@/model/rest/user/CreateUserResponse";
import { LoginRequest } from "@/model/rest/user/LoginRequest";
import type { LoginResponse } from "@/model/rest/user/LoginResponse";
import type { ShowUserListResponse } from "@/model/rest/user/ShowUserListResponse";
import type { UpdateUserRequest } from "@/model/rest/user/UpdateUserRequest";
import type { UserValidation } from "@/model/user/UserValidation";
import type { AccessRelation } from "@/model/user/AccessRelation";
import type { User } from "@/model/user/User";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";
import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapUserToTransport,
  mapUserTransportToModel,
} from "./mapper/UserTransportMapper";
import {
  mapAccessRelationToTransport,
  mapAccessRelationTransportToModel,
} from "./mapper/AccessRelationTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { UpdateUserResponse } from "@/model/rest/user/UpdateUserResponse";
import type { UserTransporter } from "@/model/user/UserTransporter";
import { mapGroupTransportToModel } from "./mapper/GroupTransportMapper";

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

  async changePassword(oldPassword: string, password: string) {
    const usecase = "changePassword";
    const request: ChangePasswordRequest = {
      changePasswordRequest: { password: password, oldPassword: oldPassword },
    };

    const response = await super.put(
      request,
      UserControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 204) {
      return;
    }

    const errorResponse = (await response.json()) as ErrorResponse;

    if (errorResponse.error) {
      throwError(errorResponse.error.code);
    }
  }

  async fetchAllUser(): Promise<UserTransporter> {
    const usecase = "showUserList/all";
    const response = await super.get(UserControllerHandler.CONTROLLER, usecase);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showUserListResponse =
      (await response.json()) as ShowUserListResponse;

    if (showUserListResponse.error) {
      throwError(showUserListResponse.error.code);
    }

    const innerResponse = await showUserListResponse.showUserListResponse;
    return {
      users: innerResponse.userTransport.map((value) => {
        return mapUserTransportToModel(value);
      }),
      groups: innerResponse.groupTransport.map((value) => {
        return mapGroupTransportToModel(value);
      }),
      accessRelations: innerResponse.accessRelationTransport.map((value) => {
        return mapAccessRelationTransportToModel(value);
      }),
    };
  }

  async createUser(mpm: User, mar: AccessRelation): Promise<UserValidation> {
    const usecase = "createUser";
    const request = {
      createUserRequest: {},
    } as CreateUserRequest;
    const innerRequest = request.createUserRequest;
    innerRequest.userTransport = mapUserToTransport(mpm);
    innerRequest.accessRelationTransport = mapAccessRelationToTransport(mar);

    const response = await super.post(
      request,
      UserControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createUserResponse = (await response.json()) as CreateUserResponse;
    const innerResponse = createUserResponse.createUserResponse;
    const UserValidation = {} as UserValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    UserValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createMpm: User = mpm;
      createMpm.id = innerResponse.userId;
      UserValidation.user = createMpm;
    }
    return UserValidation;
  }
  async updateUser(mpm: User, mar: AccessRelation): Promise<ValidationResult> {
    const usecase = "updateUser";
    const request = {
      updateUserRequest: {},
    } as UpdateUserRequest;
    const innerRequest = request.updateUserRequest;
    innerRequest.userTransport = mapUserToTransport(mpm);
    innerRequest.accessRelationTransport = mapAccessRelationToTransport(mar);

    const response = await super.put(
      request,
      UserControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const updateUserResponse = (await response.json()) as UpdateUserResponse;
    const innerResponse = updateUserResponse.updateUserResponse;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
  }
  async deleteUser(id: number): Promise<ValidationResult> {
    const usecase = "deleteUserById/" + id;

    const response = await super.delete(
      UserControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const errorResponse = (await response.json()) as ErrorResponse;
      const validationResultItem = {
        error: errorResponse.error.code,
      } as ValidationResultItem;
      validationResult.result = false;
      validationResult.validationResultItems = [validationResultItem];
    }
    return validationResult;
  }
}

export default new UserControllerHandler();
