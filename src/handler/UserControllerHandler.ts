import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { ErrorCode } from "@/model/ErrorCode";
import type { ChangePasswordRequest } from "@/model/rest/user/ChangePasswordRequest";
import type { CreateUserRequest } from "@/model/rest/user/CreateUserRequest";
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
import { mapGroupTransportToModel } from "./mapper/GroupTransportMapper";
import type { Group } from "@/model/group/Group";
import type { ShowEditUserResponse } from "@/model/rest/user/ShowEditUserResponse";
import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import { UserControllerApi } from "@/api";
import { WebServer } from "./WebServer";
import type { ValidationItemTransport } from "@/model/rest/transport/ValidationItemTransport";
import axios from "axios";
import {
  setAuthTokens,
  getBrowserLocalStorage,
  applyAuthTokenInterceptor,
  type TokenRefreshRequest,
  getBrowserSessionStorage,
  getAccessToken,
  getRefreshToken,
} from "axios-jwt";

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

    if (loginResponse.code) {
      throwError(loginResponse.code);
    }
    const userTransport = loginResponse.userTransport;

    const userSession: UserSession = {
      userId: userTransport.id,
      userName: userTransport.userName,
      userCanLogin: userTransport.userCanLogin === 1 ? true : false,
      userIsNew: userTransport.userIsNew === 1 ? true : false,
      userIsAdmin: userTransport.userIsAdmin === 1 ? true : false,
      userAuthorizationToken: loginResponse.token,
      userRefreshToken: loginResponse.refreshToken,
    };

    userSessionStore.setUserSession(userSession);
    setAuthTokens({
      accessToken: loginResponse.token,
      refreshToken: loginResponse.refreshToken,
    });
  }

  async changePassword(oldPassword: string, password: string) {
    const usecase = "changePassword";
    const request: ChangePasswordRequest = {
      password: password,
      oldPassword: oldPassword,
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

    if (errorResponse.code) {
      throwError(errorResponse.code);
    }
  }

  async fetchAllUser(): Promise<Array<User>> {
    const usecase = "showUserList";
    const response = await super.get(UserControllerHandler.CONTROLLER, usecase);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showUserListResponse =
      (await response.json()) as ShowUserListResponse;

    if (showUserListResponse.code) {
      throwError(showUserListResponse.code);
    }

    const groups: Array<Group> = showUserListResponse.groupTransports.map(
      (value) => {
        return mapGroupTransportToModel(value);
      }
    );
    const users: Array<User> = showUserListResponse.userTransports.map(
      (value) => {
        return mapUserTransportToModel(value);
      }
    );
    const accessRelations: Array<AccessRelation> =
      showUserListResponse.accessRelationTransports.map((value) => {
        return mapAccessRelationTransportToModel(value);
      });

    const groupsById = new Map<number, Group>();
    for (const group of groups) {
      groupsById.set(group.id, group);
    }

    const accessRelationsById = new Map<number, AccessRelation>();
    for (const accessRelation of accessRelations) {
      if (accessRelation.id)
        accessRelationsById.set(accessRelation.id, accessRelation);
    }

    for (const user of users) {
      const accessRelation = accessRelationsById.get(user.id);
      if (accessRelation) {
        user.groupId = accessRelation.refId;
        const group = groupsById.get(user.groupId);
        if (group) {
          user.groupName = group.name;
        }
      }
    }

    return users;
  }

  async getAllAccessRelations(userId: number): Promise<Array<AccessRelation>> {
    const usecase = "showEditUser/" + userId;
    const response = await super.get(UserControllerHandler.CONTROLLER, usecase);

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const showEditUserResponse =
      (await response.json()) as ShowEditUserResponse;

    const accessRelations: Array<AccessRelation> =
      showEditUserResponse.accessRelationTransports.map((value) => {
        return mapAccessRelationTransportToModel(value);
      });

    return accessRelations;
  }

  async createUser(mpm: User): Promise<UserValidation> {
    const request = {} as CreateUserRequest;
    request.userTransport = mapUserToTransport(mpm);

    if (mpm.groupId) {
      const mar: AccessRelation = {
        refId: mpm.groupId,
        validFrom: new Date(),
      };
      request.accessRelationTransport = mapAccessRelationToTransport(mar);
    }

    const axiosInstance = axios.create({
      baseURL: "http://" + WebServer.getInstance().getWebServer(),
      withCredentials: true,
    });

    const requestRefresh: TokenRefreshRequest = async (
      refreshToken: string
    ) => {
      await super.refreshAuthToken();
      const userSessionStore = useUserSessionStore();
      return {
        accessToken: userSessionStore.getAuthorizationToken,
        refreshToken: userSessionStore.getRefreshToken,
      };
    };

    applyAuthTokenInterceptor(axiosInstance, { requestRefresh });

    const userSessionStore = useUserSessionStore();
    setAuthTokens({
      accessToken: userSessionStore.getAuthorizationToken,
      refreshToken: userSessionStore.getRefreshToken,
    });

    const userControllerApi = new UserControllerApi(
      undefined,
      undefined,
      axiosInstance
    );
    const response = await userControllerApi.createUser(request);

    const createUserResponse = response.data;
    const UserValidation = {} as UserValidation;
    const validationResult: ValidationResult = {
      result: createUserResponse.result,
      validationResultItems: createUserResponse.validationItemTransports?.map(
        (vit: ValidationItemTransport) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    UserValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createMpm: User = mpm;
      createMpm.id = createUserResponse.userId;
      UserValidation.user = createMpm;
    }
    return UserValidation;
  }
  async updateUser(mpm: User, mar: AccessRelation): Promise<ValidationResult> {
    const usecase = "updateUser";
    const request = {} as UpdateUserRequest;
    request.userTransport = mapUserToTransport(mpm);
    request.accessRelationTransport = mapAccessRelationToTransport(mar);

    const response = await super.put(
      request,
      UserControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const updateUserResponse = (await response.json()) as UpdateUserResponse;
    const validationResult: ValidationResult = {
      result: updateUserResponse.result,
      validationResultItems: updateUserResponse.validationItemTransports?.map(
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
        error: errorResponse.code,
      } as ValidationResultItem;
      validationResult.result = false;
      validationResult.validationResultItems = [validationResultItem];
    }
    return validationResult;
  }
}

export default new UserControllerHandler();
