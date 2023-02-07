import { clearAuthTokens, setAuthTokens } from "axios-jwt";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import {
  UserControllerApi,
  type ChangePasswordRequest,
  type CreateUserRequest,
  type LoginRequest,
  type UpdateUserRequest,
  type ValidationItemTransport,
} from "@/api";

import {
  useUserSessionStore,
  type UserSession,
} from "@/stores/UserSessionStore";

import { throwError } from "@/tools/views/ThrowError";

import { mapGroupTransportToModel } from "./mapper/GroupTransportMapper";
import {
  mapUserToTransport,
  mapUserTransportToModel,
} from "./mapper/UserTransportMapper";
import {
  mapAccessRelationToTransport,
  mapAccessRelationTransportToModel,
} from "./mapper/AccessRelationTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

import { ErrorCode } from "@/model/ErrorCode";
import type { Group } from "@/model/group/Group";
import type { UserValidation } from "@/model/user/UserValidation";
import type { AccessRelation } from "@/model/user/AccessRelation";
import type { User } from "@/model/user/User";
import type { ValidationResult } from "@/model/validation/ValidationResult";

import AbstractControllerHandler from "@/handler/AbstractControllerHandler";

class UserControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "user";
  private userControllerApi: UserControllerApi;

  public constructor() {
    super();

    this.userControllerApi = new UserControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async login(username: string, password: string): Promise<void> {
    const loginRequest: LoginRequest = {
      userName: username,
      userPassword: password,
    };

    const userSessionStore = useUserSessionStore();
    userSessionStore.logout();
    clearAuthTokens();

    return this.userControllerApi
      .login(loginRequest)
      .then((response) => {
        const loginResponse = response.data;

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
      })
      .catch((reason) => {
        if (reason.response.status === 403)
          throwError(ErrorCode.USERNAME_PASSWORD_WRONG);
        throw new Error(reason.response.statusText);
      });
  }

  async changePassword(oldPassword: string, password: string) {
    const request: ChangePasswordRequest = {
      password: password,
      oldPassword: oldPassword,
    };

    return this.userControllerApi.changePassword(request).then((response) => {
      return super.handleResponseError(response);
    });
  }

  async fetchAllUser(): Promise<Array<User>> {
    return this.userControllerApi.showUserList().then((response) => {
      super.handleResponseError(response);

      const showUserListResponse = response.data;

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
    });
  }

  async getAllAccessRelations(userId: number): Promise<Array<AccessRelation>> {
    return this.userControllerApi.showEditUser(userId).then((response) => {
      super.handleResponseError(response);

      const showEditUserResponse = response.data;

      const accessRelations: Array<AccessRelation> =
        showEditUserResponse.accessRelationTransports.map((value) => {
          return mapAccessRelationTransportToModel(value);
        });

      return accessRelations;
    });
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

    return this.userControllerApi.createUser(request).then((response) => {
      super.handleResponseError(response);

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
    });
  }

  async updateUser(mpm: User, mar: AccessRelation): Promise<ValidationResult> {
    const request = {} as UpdateUserRequest;
    request.userTransport = mapUserToTransport(mpm);
    request.accessRelationTransport = mapAccessRelationToTransport(mar);

    return this.userControllerApi.updateUser(request).then((response) => {
      super.handleResponseError(response);

      const updateUserResponse = response.data;

      const validationResult: ValidationResult = {
        result: updateUserResponse.result,
        validationResultItems: updateUserResponse.validationItemTransports?.map(
          (vit) => {
            return mapValidationItemTransportToModel(vit);
          }
        ),
      };

      return validationResult;
    });
  }

  async deleteUser(id: number): Promise<ValidationResult> {
    return this.userControllerApi.deleteUserById(id).then((response) => {
      return super.handleResponseErrorAsValidationResult(response);
    });
  }
}

export default new UserControllerHandler();
